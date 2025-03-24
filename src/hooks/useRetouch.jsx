import { useState, useEffect, useCallback, useContext, createContext, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MonsterApiClient from "monsterapi";
import { GoogleGenerativeAI } from "@google/generative-ai";


const RetouchContext = createContext()

export const useRetouch = () => useContext(RetouchContext)

const RetouchProvider = ({children}) => {

    const [selectedFiles, setSelectedFiles] = useState({});

    const onDrop = useCallback((acceptedFiles) => {
      setSelectedFiles(acceptedFiles[0]);
    }, []);

    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadedFile, setUploadedFile] = useState({});

    const uploadToCloudinary = async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_PRESET);
    
      try {
        setUploading(true);
        const response = await axios.post(
          'https://api.cloudinary.com/v1_1/dduz5dnhy/image/upload',
          formData,
          {
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percentCompleted);
            }
          }
        );
        // Reemplazar 'http' por 'https' si es necesario
        const secureUrl = response.data.url.replace(/^http:\/\//i, 'https://');
        setUploadedFile({ ...response.data, url: secureUrl });
      } catch (error) {
        console.error('Error al subir el archivo:', error);
      } finally {
        setUploading(false);
        setUploadProgress('Archivo subido');
      }
    };
    

    useEffect(() => {
        if (selectedFiles?.name) {
            uploadToCloudinary(selectedFiles)
        }        
    }, [selectedFiles])

    const [userPrompt, setUserPrompt] = useState('')
    const [isEmptyUserPrompt, setIsEmptyUserPrompt] = useState(false)
    const textareaChatRef = useRef(null)

    const validatePromptUser = (value) => {
        const isValid = ((value.length >  0) && (!(value.trim() === ''))) ? true : false 
  
        return isValid
      }

    const handleChangeUserPrompt = (e) => {
        setUserPrompt(e.target.value)
        setIsEmptyUserPrompt(validatePromptUser(e.target.value))
    }

    useEffect(() => {
    if (userPrompt === '') {
      textareaChatRef.current.style.height = 'auto';
      textareaChatRef.current.style.height = `${textareaChatRef.current.scrollHeight}px`;
    }
    },[userPrompt])

    const handleIncompletedForm = (errorText) => {
      Swal.fire({
        html: errorText,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'swal2-popup',
            content: 'swal2-content',
            actions: 'swal2-actions',
            confirmButton: 'swal2-confirm',
        }
    });
    }

    const handleErrorMonsterapi = (errorText) => {
      Swal.fire({
        title: `Error al retocar la imagen:`,
        html: errorText,
        confirmButtonText: 'Aceptar',
        customClass: {
            popup: 'swal2-popup',
            content: 'swal2-content',
            actions: 'swal2-actions',
            confirmButton: 'swal2-confirm',
        }
    });
    }

    const [isFormCompleted, setIsFormCompleted] = useState(false)

    const handleCompletedForm = () => {
      setIsFormCompleted(true)
    }

    const client = new MonsterApiClient(import.meta.env.VITE_MONSTER)

    const model = 'photo-maker'; // Replace with the desired model name
    const input = {
      "prompt": userPrompt,
      "init_image_url": uploadedFile.url,
      "negprompt": "deformed, bad anatomy, disfigured, poorly drawn face",
      "steps": 40,
      "samples": 1,
      "strength": 40,
      "seed": 2414,
      "safe_filter": false
    };

    const [responseImg, setResponseImg] = useState('')

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_G)

    async function generateImage(imageUrl, prompt) {
      try {
        // Obtener la imagen desde la URL
        const response = await fetch(imageUrl);
        const arrayBuffer = await response.arrayBuffer();
    
        // Convertir ArrayBuffer a cadena Base64 (compatible con navegador)
        let binary = '';
        const bytes = new Uint8Array(arrayBuffer);
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64Image = window.btoa(binary);
    
        // Preparar el contenido para la API de Gemini
        const contents = [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/png", // Ajusta si la imagen es de otro formato
              data: base64Image
            }
          }
        ];
    
        // Configurar el modelo de generación de imágenes
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash-exp-image-generation",
          generationConfig: {
            responseModalities: ["Text", "Image"]
          }
        });
    
        // Generar la imagen con la API de Gemini
        const apiResponse = await model.generateContent(contents);
        for (const part of apiResponse.response.candidates[0].content.parts) {
          if (part.inlineData) {
            // Convertir la imagen generada de Base64 a una URL utilizable
            const generatedImageBase64 = part.inlineData.data;
            const generatedImageUrl = `data:image/png;base64,${generatedImageBase64}`;
            return generatedImageUrl;
          }
        }
      } catch (error) {
        console.error("Error generating content:", error);
        handleErrorMonsterapi(error);
        return null;
      }
    }
    

    const generateRetouchImg = () => {
      generateImage(uploadedFile.url, userPrompt)
      .then((imageUrl) => {
          if (imageUrl) {
              setResponseImg(imageUrl)
              // Aquí puedes actualizar el estado en React para mostrar la imagen
          }
      });
    }

 

    return <RetouchContext.Provider value={{ onDrop, uploadProgress, uploadedFile, selectedFiles, userPrompt, textareaChatRef, handleChangeUserPrompt, handleIncompletedForm, isEmptyUserPrompt, isFormCompleted, handleCompletedForm, responseImg, generateRetouchImg }}>
        {children}
    </RetouchContext.Provider>
}

export default RetouchProvider
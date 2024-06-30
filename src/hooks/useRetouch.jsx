import { useState, useEffect, useCallback, useContext, createContext, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import MonsterApiClient from "monsterapi";


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
        formData.append('upload_preset', import.meta.env.VITE_PRESET); // Reemplaza con tu upload preset
    
        try {
          setUploading(true);
          const response = await axios.post(
            'https://api.cloudinary.com/v1_1/dduz5dnhy/image/upload', // Reemplaza con tu cloud name
            formData,
            {
              onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setUploadProgress(percentCompleted);
              }
            }
          );
          setUploadedFile(response.data);
        } catch (error) {
          console.error('Error al subir el archivo:', error);
        } finally {
          setUploading(false);
          setUploadProgress('Archivo subido')
        }
      };

    useEffect(() => {
        if (selectedFiles?.name) {
            uploadToCloudinary(selectedFiles)
        }        
    }, [selectedFiles])

    useEffect(() => {
        console.log(uploadProgress)
    }, [uploadProgress])

    useEffect(() => {
        console.log(uploadedFile.url)
    }, [uploadedFile])

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
        if (textareaChatRef.current.scrollHeight > 60) {
            textareaChatRef.current.style.height = 'auto';
            textareaChatRef.current.style.height = `${textareaChatRef.current.scrollHeight}px`;
        }
    }

    const handleIncompletedForm = (errorText) => {
      Swal.fire({
        title: `Formulario incompleto:`,
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

    const [responseImg, setResponseImg] = useState({ output: []})

    const generateRetouchImg = () => {
         client.generate(model, input)
    .then((response) => {
      // Handle the response from the API
      console.log('Generated content:', response);
      setResponseImg(response)
    })
    .catch((error) => {
      // Handle API errors
      console.error('Error:', error);
      handleErrorMonsterapi(error)
    });
    }

 

    return <RetouchContext.Provider value={{ onDrop, uploadProgress, selectedFiles, userPrompt, textareaChatRef, handleChangeUserPrompt, handleIncompletedForm, isEmptyUserPrompt, isFormCompleted, handleCompletedForm, responseImg, generateRetouchImg  }}>
        {children}
    </RetouchContext.Provider>
}

export default RetouchProvider
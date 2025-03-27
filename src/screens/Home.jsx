import { useDropzone } from "react-dropzone";
import { useRetouch } from "../hooks/useRetouch";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { onDrop, uploadProgress, selectedFiles, userPrompt, textareaChatRef, handleChangeUserPrompt, handleIncompletedForm, isEmptyUserPrompt, handleCompletedForm, generateRetouchImg, uploadedFile} = useRetouch()
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {   'image/jpeg': [],
        'image/png': [],
        'image/webp': [],
        'image/heic': [],
        'image/jfif': [],}
        ,multiple: false });

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!selectedFiles?.name) {
            handleIncompletedForm('<img class="error__icon" src="https://media.tenor.com/fzCt8ROqlngAAAAM/error-error404.gif"/> <p class="glitch-error" data-glitch="Formulario incompleto:">Formulario incompleto:</p> <br> <p class="glitch-error" data-glitch="Debes subir una imagen para retocar">Debes subir una imagen para retocar</p>')
            return
        }

        if (uploadProgress !== 'Archivo subido') {
            handleIncompletedForm('<br><br> <p class="glitch-error" data-glitch="Espera un poco más a que la imagen se suba por completo">Espera un poco más a que la imagen se suba por completo</p>')
            return
        }

        if (isEmptyUserPrompt === false) {
            handleIncompletedForm('<img class="error__icon" src="https://media.tenor.com/fzCt8ROqlngAAAAM/error-error404.gif"/> <p class="glitch-error" data-glitch="Formulario incompleto:">Formulario incompleto:</p> <br> <p class="glitch-error" data-glitch="Debes describir el atuendo y el fondo que quieres">Debes describir el atuendo y el fondo que quieres</p>')
            return
        }
        handleCompletedForm()
        generateRetouchImg()
        navigate('/response')
    }

    return <section className='main__container'>
        <div className='interface'>
            <div className='interface__card'>
                <h1 className='card__title'>
                    Mr. Retouch
                </h1>
                <div className="card__image"/>
                { !selectedFiles?.name && <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone__active' : ''}`}>
                <input {...getInputProps()} />
                <p className='dropzone__text'>{isDragActive ? "Suelta la foto aquí..." : "Arrastra y suelta la foto a editar aquí, o haz clic para seleccionarla"}</p>
                </div>}
                { selectedFiles?.name && <div className='dropzone__loading'>
                    <p className='dropzone__filename'>{selectedFiles.name}</p>
                    {uploadProgress === 'Archivo subido' && <img src={uploadedFile.url} className='dropzone__image' />}
                    <div className='loading__borderBar' uploadprogress={uploadProgress === 'Archivo subido' ? uploadProgress : `${uploadProgress}%`}>
                        <div className='loading__bar' style={{ width: `${uploadProgress}%`}}></div>
                    </div>
                </div>}
                <form className='form' onSubmit={handleSubmit}>
                    <textarea placeholder='Describe aquí lo que quieres cambiar de la imagen' cols='1' rows='1' className='form__input' ref={textareaChatRef} value={userPrompt} onChange={handleChangeUserPrompt}></textarea>
                    <button className="form__button">Retocar imagen</button>
                </form>
                <a href="https://daniels-portafolio.vercel.app/" className="card__footer">
                    <p className="glitch" data-glitch="<> Daniel Franqui </>">{'<> Daniel Franqui </>'}</p>
                </a>
            </div>
        </div>
    </section>
}

export default Home
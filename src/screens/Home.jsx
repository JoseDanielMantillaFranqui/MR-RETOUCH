import { useDropzone } from "react-dropzone";
import { useRetouch } from "../hooks/useRetouch";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { onDrop, uploadProgress, selectedFiles, userPrompt, textareaChatRef, handleChangeUserPrompt, handleIncompletedForm, isEmptyUserPrompt, handleCompletedForm, generateRetouchImg } = useRetouch()
  
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: {   'image/jpeg': [],
        'image/png': [],
        'image/webp': [],
        'image/heic': [],
        'image/jfif': [],}
        ,multiple: false });

    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        if (uploadProgress !== 'Archivo subido') {
            handleIncompletedForm('Debes subir una imagen para retocar')
            return
        }

        if (isEmptyUserPrompt === false) {
            handleIncompletedForm('Debes describir lo que quieres retocar de la imagen subida')
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
                <img src="https://i.gifer.com/7Tf.gif" className="card__image"/>
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzone__active' : ''}`}>
                <input {...getInputProps()} />
                <p className='dropzone__text'>{isDragActive ? "Suelta el archivo aquí..." : "Arrastra y suelta un archivo aquí, o haz clic para seleccionarlo"}</p>
                </div>
                { selectedFiles?.name && <div className='dropzone__loading'>
                    <p className='dropzone__filename'>{selectedFiles.name}</p>
                    <div className='loading__borderBar' uploadprogress={uploadProgress === 'Archivo subido' ? uploadProgress : `${uploadProgress}%`}>
                        <div className='loading__bar' style={{ width: `${uploadProgress}%`}}></div>
                    </div>
                </div>}
                <form className='form' onSubmit={handleSubmit}>
                    <textarea placeholder='Describe aquí lo que quieres retocar' cols='1' rows='1' className='form__input' ref={textareaChatRef} value={userPrompt} onChange={handleChangeUserPrompt}></textarea>
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
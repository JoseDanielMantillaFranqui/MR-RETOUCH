import { useRetouch } from "../hooks/useRetouch";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Response = () => {

    const {isFormCompleted, responseImg} = useRetouch()

    const navigate = useNavigate()

    useEffect(() => {
        const handlePopState = (event) => {
              event.preventDefault()
              window.location.replace('/')
          }
    
        window.addEventListener('popstate', handlePopState);
  
      }, [navigate]);
    useEffect(() => {
        if (isFormCompleted === false) {
            return navigate('/')
        } 
    }, [isFormCompleted])
    

    return <section className='main__container'>
        <div className='interface'>
            <div className='interface__card'>
                <h1 className='card__title'>
                    Mr. Retouch
                </h1>
                <div className="response">
                    {responseImg.output.length > 0 ? <> <img className="response__image" src={responseImg.output[0]} />
                    <a href={responseImg.output[0]} className="response__download">Descargar Imagen</a>
                    <a href="/" className="response__goToBack">Volver</a></>
                    :
                    <img src="https://i.gifer.com/AqCa.gif" alt="" className="response__image" />
                    }
                </div>
            </div>
        </div>
    </section>
}

export default Response
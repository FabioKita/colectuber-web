import React from "react";
import styles from "../styles/errores.module.scss"

const ErrorPage=({
    errorCode= 500,
    errorMessage
})=> {
    return(
        <div className={styles.main}>

        
           <h1>Error</h1>
           <h1 className={styles.errorCode}>{errorCode}</h1>
            <p className={styles.errorText}>{
                errorMessage?
                errorMessage:
                "Lo sentimos. Pero ocurrio un error."
            }</p>
           <p><a className={styles.errorLink} href="/">Volver al Inicio</a></p>
          
        </div>
    )
}

export default ErrorPage;
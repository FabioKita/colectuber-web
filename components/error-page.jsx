import Link from "next/link";
import React from "react";
import styles from "styles/errores.module.scss"

const ErrorPage=({
    errorCode = 500,
    errorMessage
})=> {
    return(
        <div className={styles.main}>
           <h1 className={styles.errorLabel}>Error</h1>
           <h1 className={styles.errorCode}>{errorCode}</h1>
            <p className={styles.errorText}>{
                errorMessage?
                errorMessage:
                "Lo sentimos. Pero ocurrio un error."
            }</p>
            <Link href={"/"}>
                <a className={styles.errorLink}>Volver al Inicio</a>
            </Link>
        </div>
    );
}

export default ErrorPage;
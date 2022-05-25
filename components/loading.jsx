import React from "react"
import styles from 'styles/loading.module.scss'
const Loading = () =>{


    return (
        <div className={styles.body}>
            <div className={styles.load}>
                <img src="public/markers/colectivo/colectivo-red.svg"></img>
            </div>

            <div className={styles.text}>
                <h1>Loading...</h1>
            </div>


        </div>

    )
}

export default  Loading
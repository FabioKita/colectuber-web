import React from "react"
import styles from 'styles/loading.module.scss'
import {FaBusAlt} from 'react-icons/fa'

const Loading = () =>{
    return (
        <div className={styles.body}>
            <div className={styles.load}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            <div className={styles.load1}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            <div className={styles.load2}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            <div className={styles.load3}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            <div className={styles.load4}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            <div className={styles.load5}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            <div className={styles.load6}>
                <FaBusAlt color='white'></FaBusAlt>
            </div>
            
            <div className={styles.text}>
                <h1>LOADING...</h1>
            </div>
        </div>

    )
}

export default  Loading
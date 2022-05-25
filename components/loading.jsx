import React from "react"
import styles from 'styles/loading.module.scss'
import {FaBusAlt} from 'react-icons/fa'

const Loading = () =>{


    return (
        <div className={styles.body}>
            <div className={styles.load}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>
            <div className={styles.load1}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>
            <div className={styles.load2}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>
            <div className={styles.load3}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>
            <div className={styles.load4}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>
            <div className={styles.load5}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>
            <div className={styles.load6}>
                <FaBusAlt size={30} color='white'></FaBusAlt>
            </div>




            <div className={styles.text}>
                <h1>LOADING...</h1>
            </div>


        </div>

    )
}

export default  Loading
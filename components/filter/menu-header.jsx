import React,{useState} from 'react';
import styles from 'styles/menu.module.scss';
import { FaBars, FaArrowLeft } from 'react-icons/fa';

const MenuHeader = ({
    onClick,
    shown = false
})=>{
    if(!shown){
        return <div className={styles.MenuHeader + " " + styles.hidden}>
            <button onClick={onClick}>
                <FaBars/>
            </button>
            <div>
                
            </div>
        </div>
    }else{
        return <div className={styles.MenuHeader + " " + styles.shown}>
            <button onClick={onClick}>
                <FaArrowLeft/>
            </button>
            <div>
                <input type={"text"} placeholder={"Buscar en colectuber..."}/>
            </div>
        </div>
    }
}

export default MenuHeader;
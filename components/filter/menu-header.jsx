import React,{useState} from 'react';
import styles from 'styles/menu.module.scss';
import { FaBars, FaArrowLeft } from 'react-icons/fa';
import { useMenuContext } from 'src/context/menu-context-provider';

const MenuHeader = ({
    onClick,
    shown = false
})=>{
    const menuContext = useMenuContext();

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
                <input 
                    type={"text"} 
                    placeholder={"Buscar en colectuber..."}
                    value={menuContext.keyword}
                    onChange={(e)=>{
                        let target = e.target;
                        menuContext.setKeyword(target.value);
                    }}
                    onKeyDown={(e)=>{
                        let target = e.target;
                        if (e.key === "Enter") {
                            // Cancel the default action, if needed
                            e.preventDefault();
                            console.log(target.value);
                        }
                    }}
                />
            </div>
        </div>
    }
}

export default MenuHeader;
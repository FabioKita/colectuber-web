import React, {useRef, useEffect} from 'react';
import styles from 'styles/menu.module.scss'

const MenuPanel = ({
    children,
    hidden = false
})=>{
    if(hidden){
        return<div className={styles.MenuPanel + " " + styles.hidden}>
            {children}
        </div>
    }else{
        return <div className={styles.MenuPanel}>
            {children}
        </div>
    }
}

export default MenuPanel;
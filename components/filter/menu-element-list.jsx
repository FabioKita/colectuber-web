import React, {useRef, useEffect, useState} from 'react';
import styles from 'styles/menu.module.scss'

const MenuElementList = ({
    className
})=>{
    const [open, setOpen] = useState(false);

    return <div className={styles.MenuElementList + " " + (!open?styles.closed:"") + " " + className}>
        <div className={styles.Header}
            onClick={()=>{setOpen(!open)}}
        >
            <b>Hola</b>
        </div>
        <div className={styles.Body}>
            <div className={styles.Element}>
                Hola
            </div>
            <div className={styles.Element}>
                Hola
            </div>
        </div>
    </div>
}

export default MenuElementList;
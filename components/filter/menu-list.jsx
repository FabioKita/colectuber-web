import React, {useRef, useEffect, useState} from 'react';
import styles from 'styles/menu.module.scss';
import {FaAngleDown, FaAngleUp} from 'react-icons/fa'

export const MenuList = ({
    children = [],
    id = "",
    className
})=>{
    const renderChildren = ()=>{
        if(!Array.isArray(children)) return children
        return children.map((child, index)=>{
            return <div key={id+index} className={styles.ListElement}>
                {child}
            </div>
        })
    }

    return <div className={styles.MenuList + " " + className}>
        {renderChildren()}
    </div>
}

export const MenuListElement = ({
    children,
    className,
    color,
    title = "Hola"
})=>{
    const [open, setOpen] = useState(false);
    
    const headerRef = useRef();
    const contentRef = useRef();

    useEffect(()=>{
        let content = contentRef.current;
        if(open){
            content.style.maxHeight = content.scrollHeight + "px";
        }else{
            content.style.maxHeight = null;
        }
    },[open])

    useEffect(()=>{
        if(!color) return;
        let container = headerRef.current;
        container.style.borderTopColor = color;
    },[color]);

    return <div className={styles.MenuListElement + " " + className + " " + (!open?styles.closed:"")}>
        <div ref={headerRef} className={styles.Header} onClick={()=>{setOpen(!open)}}>
            <b>{title}</b>
        </div>
        <div ref={contentRef} className={styles.Body}>
            {children}
        </div>
    </div>
}

export const MenuElement = ({
    className,
    content = "Hola",
    selected,
    onSelect = ()=>{}
})=>{
    const select = ()=>{
        onSelect();
    }

    return <div 
        className={styles.MenuElement + " " + className + " " + (selected?styles.selected:"")}
        onClick={select}
    >
        {content}
    </div>
}
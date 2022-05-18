import React, {useRef, useEffect, useState} from 'react';
import styles from 'styles/menu.module.scss'

const MenuTabs = ({
    selectedTab = 0,
    tabs = [],
    children = [],
    onTabClick = (index)=>{},
    className
})=>{
    const renderTabs = ()=>{
        if(tabs.length <= 0) return "";

        return tabs.map((tab, index)=>{
            return <button 
                key={index}
                className={styles.Tab + " " + (index == selectedTab?styles.selected:"")}
                onClick={()=>{if(selectedTab != index) onTabClick(index)}}
            >
                <b>{tab}</b>
            </button>
        })
    }

    const renderChildren = ()=>{
        if(!Array.isArray(children)){
            return <div className={styles.Content}>
                {children}
            </div>
        }

        return children.map((child, index)=>{
            return <div key={index} className={styles.Content + " " + (selectedTab!=index?styles.hidden:"")}>
                {child}
            </div>
        });
    }

    return <div className={styles.MenuTabs + " " + className}>
        <div className={styles.Header}>
            {renderTabs()}
        </div>
        <div className={styles.Body}>
            {renderChildren()}
        </div>
    </div>
}

export default MenuTabs;
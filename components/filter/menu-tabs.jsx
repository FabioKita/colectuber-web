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
                className={styles.Tab + " " + (index == selectedTab?styles.selected:"")}
                onClick={()=>{if(selectedTab != index) onTabClick(index)}}
            >
                <b>{tab}</b>
            </button>
        })
    }

    const renderChildren = ()=>{
        if(selectedTab < 0 || selectedTab >= children.length) return "";

        return <div className={styles.Content}>
            {children[selectedTab]}
        </div>
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
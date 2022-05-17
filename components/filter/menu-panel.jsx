import React, {useRef, useEffect, useState} from 'react';
import styles from 'styles/menu.module.scss'
import MenuElementList from './menu-element-list';
import MenuTabs from './menu-tabs';

const MenuPanel = ({
    hidden = false
})=>{
    const [selectedTab, setSelectedTab] = useState(0);

    const changeTab = (index)=>{
        setSelectedTab(index);
    }

    return<div className={styles.MenuPanel + " " + (hidden?styles.hidden:"")}>
        <MenuTabs 
            className={styles.Content} 
            tabs={["Colectivos", "Paradas"]}
            onTabClick={changeTab}
            selectedTab={selectedTab}
        >
            <div className={styles.Page}>
                <MenuElementList className={styles.Element}>

                </MenuElementList>
                <MenuElementList className={styles.Element}>

                </MenuElementList>
            </div>
            <div className={styles.Page}>
                <MenuElementList className={styles.Element}>

                </MenuElementList>
            </div>
        </MenuTabs>
    </div>
}

export default MenuPanel;
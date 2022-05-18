import React, {useRef, useEffect, useState} from 'react';
import styles from 'styles/menu.module.scss'
import {MenuList, MenuElement, MenuListElement} from './menu-list';
import MenuTabs from './menu-tabs';

const MenuPanel = ({
    hidden = false
})=>{
    const [selectedTab, setSelectedTab] = useState(0);

    const changeTab = (index)=>{
        setSelectedTab(index);
    }

    return <div className={styles.MenuPanel + " " + (hidden?styles.hidden:"")}>
        <MenuTabs 
            className={styles.Content} 
            tabs={["Colectivos", "Paradas"]}
            onTabClick={changeTab}
            selectedTab={selectedTab}
        >
            <MenuList>
                <MenuListElement>
                    <MenuElement/>
                    <MenuElement/>
                    <MenuElement/>
                </MenuListElement>
                <MenuListElement>
                    <MenuElement/>
                    <MenuElement/>
                    <MenuElement/>
                </MenuListElement>
            </MenuList>

            <MenuList>
                <MenuListElement>
                    <MenuElement/>
                    <MenuElement/>
                    <MenuElement/>
                </MenuListElement>
                <MenuListElement>
                    <MenuElement/>
                    <MenuElement/>
                    <MenuElement/>
                </MenuListElement>
                <MenuListElement>
                    <MenuElement/>
                    <MenuElement/>
                    <MenuElement/>
                </MenuListElement>
            </MenuList>
        </MenuTabs>
    </div>
}

export default MenuPanel;
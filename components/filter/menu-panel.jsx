import React, {useRef, useEffect, useState} from 'react';
import { useDataContext } from 'src/context/data-context-provider';
import { useMenuContext } from 'src/context/menu-context-provider';
import { useSelectionContext } from 'src/context/selection-context-provider';
import styles from 'styles/menu.module.scss'
import {MenuList, MenuElement, MenuListElement} from './menu-list';
import MenuTabs from './menu-tabs';

const MenuPanel = ({
    hidden = false
})=>{
    const menuContext = useMenuContext();
    const dataContext = useDataContext();
    const selectionContext = useSelectionContext();
    const [selectedTab, setSelectedTab] = useState(0);

    const changeTab = (index)=>{
        setSelectedTab(index);
    }

    const renderColectivosList = (colectivoList)=>{
        return colectivoList.map((colectivo)=>{
            let selected = colectivo.id == selectionContext.selectedMarker;
            return <MenuElement 
                key={colectivo.id} 
                content={colectivo.number}
                selected={selected}
                onSelect={()=>{
                    if(!selected) selectionContext.selectMarker(colectivo.id)
                    else selectionContext.deselectCurrent();
                }}
            />
        })
    }

    const renderRecorridosList = ()=>{
        let mapa = menuContext.filteredColectivos;
        return Object.keys(mapa).map((key)=>{
            let recorrido = dataContext.recorridos[key];
            let list = mapa[key];
            return <MenuListElement key={recorrido.id} title={recorrido.name}>
                {renderColectivosList(list)}
            </MenuListElement>
        })
    }

    const renderParadasList = (paradaList)=>{
        return paradaList.map((parada)=>{
            let selected = parada.id == selectionContext.selectedMarker;
            return <MenuElement 
                key={parada.id} 
                content={parada.name}
                selected={selected}
                onSelect={()=>{
                    if(!selected) selectionContext.selectMarker(parada.id)
                    else selectionContext.deselectCurrent();
                }}
            />
        })
    }

    const renderZonasList = ()=>{
        let mapa = menuContext.filteredParadas;
        return Object.keys(mapa).map((key)=>{
            let list = mapa[key];
            return <MenuListElement key={key} title={key}>
                {renderParadasList(list)}
            </MenuListElement>
        })
    }

    return <div className={styles.MenuPanel + " " + (hidden?styles.hidden:"")}>
        <MenuTabs 
            className={styles.Content} 
            tabs={["Colectivos", "Paradas"]}
            onTabClick={changeTab}
            selectedTab={selectedTab}
        >
            <MenuList key={"recorridos/colectivos"}>
                {renderRecorridosList()}
            </MenuList>

            <MenuList key={"zonas/paradas"}>
                {renderZonasList()}
            </MenuList>
        </MenuTabs>
    </div>
}

export default MenuPanel;
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

    const renderRecorridosList = ()=>{
        let mapa = menuContext.filteredColectivos;
        return Object.keys(mapa).map((recorridoId)=>{
            let recorrido = dataContext.recorridos[recorridoId];
            let colectivoIdList = mapa[recorridoId];
            return <MenuListElement color={recorrido.color} key={recorrido.id} title={recorrido.name}>
                {renderColectivosList(colectivoIdList)}
            </MenuListElement>
        })
    }

    const renderColectivosList = (colectivoIdList)=>{
        return colectivoIdList.map((colectivoId)=>{
            let colectivo = dataContext.colectivos[colectivoId];
            let colectivoData = dataContext.colectivosData[colectivoId];
            let selected = colectivo.id == selectionContext.selectedMarker;
            return <MenuElement 
                key={colectivo.id} 
                content={"Colectivo N°" + colectivo.number + " - " + colectivoData.destination}
                selected={selected}
                onSelect={()=>{
                    if(!selected) selectionContext.selectMarker(colectivo.id)
                    else selectionContext.deselectMarker(colectivo.id);
                }}
                checked={selectionContext.hasInFilter(colectivo.id)}
                onCheck={(checked)=>{
                    if(checked) selectionContext.removeFromFilter(colectivo.id);
                    else selectionContext.addToFilter(colectivo.id);
                }}
            />
        })
    }

    const renderZonasList = ()=>{
        let mapa = menuContext.filteredParadas;
        return Object.keys(mapa).map((zona)=>{
            let paradaIdList = mapa[zona];
            return <MenuListElement key={zona} title={zona}>
                {renderParadasList(paradaIdList)}
            </MenuListElement>
        })
    }

    const renderParadasList = (paradaIdList)=>{
        return paradaIdList.map((paradaId)=>{
            let parada = dataContext.paradas[paradaId];
            let selected = parada.id == selectionContext.selectedMarker;
            return <MenuElement 
                key={parada.id} 
                content={parada.name}
                selected={selected}
                onSelect={()=>{
                    if(!selected) selectionContext.selectMarker(parada.id)
                    else selectionContext.deselectMarker(parada.id);
                }}
                checked={selectionContext.hasInFilter(parada.id)}
                onCheck={(checked)=>{
                    if(checked) selectionContext.removeFromFilter(parada.id);
                    else selectionContext.addToFilter(parada.id);
                }}
            />
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
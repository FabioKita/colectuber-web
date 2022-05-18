import React,{ useState, useEffect, useContext, useReducer, useMemo } from 'react';
import { useDataContext } from './data-context-provider';

const MenuContext = React.createContext();

export const useMenuContext = ()=>{
    return useContext(MenuContext);
}

export const MenuProvider = ({
    children
})=>{
    const data = useDataContext();

    //CLASIFICATION FUNCTIONS
    /*Funcion para clasificar los colectivos por recorridos*/
    const _getColectivosPorRecorrido = (colectivos, recorridos) => {
        let map = {}

        //Clasificamos los colectivos por recorrido
        for (let i = 0; i < recorridos.length; i++) {
            let busesToRoute = []
            for (let j = 0; j < colectivos.length; j++) {
                if(!colectivos[j].isValid()) continue;
                if (recorridos[i].id == colectivos[j].recorrido.id) {
                    busesToRoute.push(colectivos[j])
                }
            }
            map[recorridos[i].id] = busesToRoute;
        }

        return map
    }

    /*Funcion para obtener las zonas por medio de la lista de paradas*/
    const getZonas = (paradas) => {
        //Obtener todas las zonas de la tabla paradas
        let zonas = []
        for (let i = 0; i < paradas.length; i++) {
            let zonaNew = paradas[i].zone
            let control = 0

            for (let j = 0; j < zonas.length; j++) {
                if (zonaNew == zonas[j]) {
                    control += 1
                }
            }
            if (control == 0) {
                zonas.push(zonaNew)
            }
        }
        return zonas
    }
    /*Funcion para clasificar las paradas por zonas*/
    const _getParadasPorZonas = (paradas) => {
        let map = {}
        let zonas = getZonas(paradas)

        // Clasificamos las paradas por zonas

        for (let i = 0; i < zonas.length; i++) {
            let stopsToZone = []
            for (let j = 0; j < paradas.length; j++) {
                if (zonas[i] == paradas[j].zone) {
                    stopsToZone.push(paradas[j])
                }
            }
            map[zonas[i]] = stopsToZone;
        }
        return map
    }

    //FILTER FUNCTIONS
    const [keyword, setKeyword] = useState("");

    const _filterColectivo = (listData, keyword) => {
        let listFilter = Object.values(listData);

        keyword = keyword.toLowerCase();

        const includeKeyword = (entity, keyword) => {
            if (!entity.isValid()) return false;
            if (entity.number.toLowerCase().includes(keyword)) {
                return true;
            } else if (entity.line.toLowerCase().includes(keyword)) {
                return true
            } else if (entity.destination.toLowerCase().includes(keyword)) {
                return true;
            } else if (entity.company.toLowerCase().includes(keyword)) {
                return true;
            } else {
                return false;
            }
        }
        
        return listFilter.filter(x => includeKeyword(x, keyword));

    }

    const _filterParada = (listData, keyword) =>{
        let listFilter = Object.values(listData);

        keyword = keyword.toLowerCase();

        const includeKeyword = (entity, keyword) =>{
            if(entity.name.toLowerCase().includes(keyword)){
                return true;
            }else if(entity.description.toLowerCase().includes(keyword)){
                return true;
            }else{
                return false;
            }
        }

        return listFilter.filter(x => includeKeyword(x, keyword));
    }

    const getColectivosPorRecorrido = ()=>{
        let filteredColectivos = _filterColectivo(Object.values(data.colectivos), keyword);
        return _getColectivosPorRecorrido(filteredColectivos, Object.values(data.recorridos))
    }

    const getParadasPorZonas = ()=>{
        let filteredParadas = _filterParada(Object.values(data.paradas), keyword);
        return _getParadasPorZonas(filteredParadas);
    }

    const filteredColectivos = useMemo(()=>{
        return getColectivosPorRecorrido();
    },[keyword])

    const filteredParadas = useMemo(()=>{
        return getParadasPorZonas();
    },[keyword])

    return <MenuContext.Provider
        value={{
            filteredColectivos,
            filteredParadas,
            keyword,
            setKeyword
        }}
    >
        {children}
    </MenuContext.Provider>
}
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

    const [keyword, setKeyword] = useState("");

    //Retorna un mapa de indices de colectivos divididos por recorridos
    const _getColectivosPorRecorridos = (colectivoIdList)=>{
        let finalMap = {};

        colectivoIdList.forEach((colectivoId)=>{
            let colectivoData = data.colectivosData[colectivoId];
            if(!colectivoData) return;
            let recorrido = colectivoData.recorrido;
            if(!recorrido) return;
            if(!finalMap[recorrido.id]) finalMap[recorrido.id] = [];
            finalMap[recorrido.id].push(colectivoId);
        })

        return finalMap;
    }
    
    //Retorna un mapa de indices de paradas divididos por zonas
    const _getParadasPorZonas = (paradaIdList)=>{
        let finalMap = {};

        paradaIdList.forEach((paradaId)=>{
            let parada = data.paradas[paradaId];
            if(!parada) return;
            let zone = parada.zone;
            if(!zone) return;
            if(!finalMap[zone]) finalMap[zone] = [];
            finalMap[zone].push(paradaId);
        })

        return finalMap;
    }

    const _filterColectivoList = (colectivoIdList, keyword)=>{
        const hasKeyword = (colectivoId, keyword) =>{
            let colectivo = data.colectivos[colectivoId];
            let colectivoData = data.colectivosData[colectivoId];
            if(!colectivo || !colectivoData) return false;
            if(colectivo.number.toLowerCase().includes(keyword)) return true;
            if(colectivo.line.toLowerCase().includes(keyword)) return true;
            if(colectivoData.destination.toLowerCase().includes(keyword)) return true;
            if(colectivo.company.toLowerCase().includes(keyword)) return true;
            return false;
        }

        return colectivoIdList.filter(colectivoId=>hasKeyword(colectivoId, keyword));
    }

    const _filterParadaList = (paradaIdList, keyword)=>{
        const hasKeyword = (paradaId, keyword)=>{
            let parada = data.paradas[paradaId];
            if(!parada) return false;
            if(parada.name.toLowerCase().includes(keyword)) return true;
            if(parada.description.toLowerCase().includes(keyword)) return true;
            return false;
        }

        return paradaIdList.filter(paradaId=>hasKeyword(paradaId, keyword));
    }

    const getColectivoIdList = ()=>{
        let colectivoIdList = Object.keys(data.colectivos);
        if(keyword) colectivoIdList = _filterColectivoList(colectivoIdList, keyword);
        return _getColectivosPorRecorridos(colectivoIdList);
    }

    const getParadaIdList = ()=>{
        let paradaIdList = Object.keys(data.paradas);
        if(keyword) paradaIdList = _filterParadaList(paradaIdList, keyword);
        return _getParadasPorZonas(paradaIdList);
    }

    const filteredColectivos = useMemo(getColectivoIdList, [keyword, data.colectivosData])

    const filteredParadas = useMemo(getParadaIdList, [keyword])

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
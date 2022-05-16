import React,{ useState, useEffect, useContext, useRef } from 'react';
import { useDataContext } from './data-context-provider';


const SelectionContext = React.createContext();

export const useSelectionContext = ()=>{
    return useContext(SelectionContext);
}

export const SelectionProvider = ({
    children
})=>{
    //Selection
    const [selectedMarker, setSelectedMarker] = useState(null);

    const selectMarker = (markerId)=>{
        setSelectedMarker(markerId);
    }

    const deselectCurrent = ()=>{
        setSelectedMarker(null);
    }

    //Filter
    const [filter, setFilter] = useState(null);

    const _addToFilter = (addId, filter)=>{
        if(filter == null) filter = [];
        else if(filter.includes(addId)) return filter;
        return [...filter, addId];
    }

    const addToFilter = (addId)=>{
        setFilter(prev=>_addToFilter(addId, prev));
    }

    const _removeFromFilter = (removeId, filter)=>{
        if(filter == null) return filter;
        else if(!filter.includes(removeId)) return filter;
        let newFilter = filter.filter(id=>id!=removeId);
        if(newFilter.length <= 0) return null;
        return newFilter;
    }

    const removeFromFilter = (removeId)=>{
        setFilter(prev=>_removeFromFilter(removeId, prev));
    }

    //Debug
    useEffect(()=>{
        console.log(filter);
    },[filter])

    const [filtrar, setFiltrar] = useState(false);

    return <SelectionContext.Provider
        value={{
            selectedMarker,
            selectMarker,
            deselectCurrent,
            filter,
            addToFilter,
            removeFromFilter,

            filtrar
        }}
    >
        {children}
    </SelectionContext.Provider>
}
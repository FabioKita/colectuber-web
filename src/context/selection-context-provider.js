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

    const deselectMarker = (markerId)=>{
        if(selectedMarker==markerId){
            deselectCurrent();
        }
    }

    const deselectCurrent = ()=>{
        setSelectedMarker(null);
    }

    //ExtraSelection
    const [extraSelectedMarker, setExtraSelectedMarker] = useState(null);

    const extraSelectMarker = (markerId)=>{
        setExtraSelectedMarker(markerId);
    }

    const extraDeselectMarker = (markerId)=>{
        if(extraSelectedMarker==markerId){
            extraDeselectCurrent();
        }
    }

    const extraDeselectCurrent = ()=>{
        setExtraSelectedMarker(null);
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

    const hasInFilter = (id)=>{
        if(!filter) return false;
        return filter.includes(id);
    }

    return <SelectionContext.Provider
        value={{
            selectedMarker,
            selectMarker,
            deselectMarker,
            deselectCurrent,

            extraSelectedMarker,
            extraSelectMarker,
            extraDeselectMarker,
            extraDeselectCurrent,

            filter,
            addToFilter,
            removeFromFilter,
            hasInFilter
        }}
    >
        {children}
    </SelectionContext.Provider>
}
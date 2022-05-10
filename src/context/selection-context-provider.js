import React,{ useState, useEffect, useContext } from 'react';

const SelectionContext = React.createContext();

export const useSelectionContext = ()=>{
    return useContext(SelectionContext);
}

export const SelectionProvider = ({
    children
})=>{
    const [selectedMarker, setSelectedMarker] = useState(null);

    const selectMarker = (markerId)=>{
        setSelectedMarker(markerId);
    }

    const deselectCurrent = ()=>{
        setSelectedMarker(null);
    }

    return <SelectionContext.Provider
        value={{
            selectedMarker,
            selectMarker,
            deselectCurrent
        }}
    >
        {children}
    </SelectionContext.Provider>
}
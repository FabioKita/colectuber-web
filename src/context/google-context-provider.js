import { useLoadScript } from '@react-google-maps/api';
import React,{ useContext } from 'react';

const GoogleContext = React.createContext();

export const useGoogleScript = ()=>{
    return useContext(GoogleContext);
}

export const GoogleScriptProvider = ({
    children
})=>{
    const script = useLoadScript({
        googleMapsApiKey: "AIzaSyDBCbGo7oxhEkicC2jY8SmGaPekY5OeSxU"
    });

    return <GoogleContext.Provider
        value={script}
    >
        {children}
    </GoogleContext.Provider>
}
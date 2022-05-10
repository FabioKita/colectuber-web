import React,{ useState, useEffect, useContext } from 'react';
import LocationService from 'src/services/location-service';

const UserLocationContext = React.createContext();

export const useUserLocationContext = ()=>{
    return useContext(UserLocationContext);
}

export const UserLocationProvider = ({
    children
})=>{
    const [permissionAsked, setPermissionAsked] = useState(false);
    const [lastKnownLocation, setLastKnownLocation] = useState(null);

    useEffect(()=>{
        LocationService.askPermissions()
            .catch(err=>console.error(err))
            .finally(()=>setPermissionAsked(true));
    },[]);

    const startLocationTracking = ()=>{
        return LocationService.startLocationTracking(
            (location)=>setLastKnownLocation(location),
            (err)=>console.error(err)
        );
    }

    const stopLocationTracking = (id)=>{
        LocationService.stopLocationTracking(id);
    }

    return <UserLocationContext.Provider
        value={{
            permissionAsked,
            lastKnownLocation,
            startLocationTracking,
            stopLocationTracking
        }}
    >
        {children}
    </UserLocationContext.Provider>
}
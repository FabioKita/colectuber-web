import React, { useState, useEffect } from "react";
import styles from "styles/index.module.scss"
import ColectuberMap from "./colectuber-map/colectuber-map";
import { useDataContext } from "src/context/data-context-provider";
import { useGoogleScript } from "src/context/google-context-provider";
import { useUserLocationContext } from "src/context/user-location-context-provider";
import Menu from "./filter/menu";
import Loading from "./loading";

const Index = () => {
    const script = useGoogleScript();
    const data = useDataContext();
    const userLocation = useUserLocationContext();

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            data.loadNewLocations().catch(err=>console.error(err));
        }, 5000);

        const locationId = userLocation.startLocationTracking();
        
        return ()=>{
            clearInterval(intervalId);
            userLocation.stopLocationTracking(locationId);
        }
    },[]);

    if(!script.isLoaded || !data.isLoaded || !userLocation.permissionAsked){
        return <Loading></Loading>
    }else{
        return <div className={styles.container}>
            <ColectuberMap/>
            <Menu/>
        </div>
    }

    
}

export default Index;
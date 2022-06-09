import React, { useState, useEffect } from "react";
import styles from "styles/index.module.scss"
import ColectuberMap from "./colectuber-map/colectuber-map";
import { useDataContext } from "src/context/data-context-provider";
import { useGoogleScript } from "src/context/google-context-provider";
import { useUserLocationContext } from "src/context/user-location-context-provider";
import Menu from "./filter/menu";
import Loading from "./loading";
import Logo from "./colectuber-map/logo";
import ErrorPage from "./error-page";

const Index = () => {
    const script = useGoogleScript();
    const data = useDataContext();
    const userLocation = useUserLocationContext();

    useEffect(()=>{
        if(data.isLoaded){
            const intervalId = setInterval(()=>{
                data.loadNewLocations().catch(err=>console.error(err));
            }, 5000);
    
            const locationId = userLocation.startLocationTracking();
            
            return ()=>{
                clearInterval(intervalId);
                userLocation.stopLocationTracking(locationId);
            }
        }
    },[data.isLoaded]);

    if(!script.isLoaded || !data.isLoaded || !userLocation.permissionAsked){
        return <Loading></Loading>
    }else if(data.isError){
        return <ErrorPage errorCode={500}></ErrorPage>
    }else{
        return <div className={styles.container}>
            <ColectuberMap/>
            <Menu/>
            <Logo/>
        </div>
    }
}

export default Index;
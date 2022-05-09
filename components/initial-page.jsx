import React, { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import styles from "styles/index.module.scss"
import ColectuberMap from "./colectuber-map/colectuber-map";
import { useDataContext } from "src/context/data-context-provider";

const InitialPage = () => {
    const script = useLoadScript({
        googleMapsApiKey: "AIzaSyDBCbGo7oxhEkicC2jY8SmGaPekY5OeSxU"
    });
    const data = useDataContext();

    useEffect(()=>{
        const intervalId = setInterval(()=>{
            data.loadNewLocations().catch(err=>console.error(err));
        }, 5000);

        return ()=>{
            clearInterval(intervalId)
        }
    },[]);

    if(!script.isLoaded || !data.isLoaded){
        return <div>Loading...</div>
    }else{
        return <div className={styles.container}>
            <ColectuberMap/>
        </div>
    }
}

export default InitialPage;
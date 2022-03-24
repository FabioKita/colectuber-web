import React from "react";
import { useLoadScript } from "@react-google-maps/api";
import styles from "styles/index.module.scss"
import ColectuberMap from "components/colectuber-map"

export default function Home() {
  //LOAD GOOGLE MAPS SCRIPT
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDBCbGo7oxhEkicC2jY8SmGaPekY5OeSxU"
  });

  if (!isLoaded) {
    return <div>Loading...</div>
  }else{
    return (
      <div className={styles.container}>
        <ColectuberMap/>
      </div>
    );
  }
}

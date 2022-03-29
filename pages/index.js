import React, {useState, useEffect} from "react";
import { useLoadScript } from "@react-google-maps/api";
import styles from "styles/index.module.scss"
import ColectuberMap from "components/colectuber-map"
import ColectuberService from "src/services/colectuber-service";

export default function Home() {
  //LOAD GOOGLE MAPS SCRIPT
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDBCbGo7oxhEkicC2jY8SmGaPekY5OeSxU"
  });

  //FLAGS, SELECTS, FOCUS, ETC
  const [dataLoaded, setDataLoaded] = useState(false);
  const [selected, setSelected] = useState([]);
  
  //DATOS
  const [colectivos, setColectivos] = useState([]);
  const [paradas, setParadas] = useState([]);

  const fetchInitialData = ()=>{
    ColectuberService.fetchInitialData()
      .then(res=>{
        setParadas(res.paradas);
        setColectivos(res.ubicaciones)
        setDataLoaded(true);
      })
      .catch(err=>console.error(err));
  }

  const fetchLocations = ()=>{
    ColectuberService.fetchLocations()
      .then(res=>setColectivos(res))
      .catch(err=>console.error(err));
  }

  useEffect(()=>{
    fetchInitialData();

    const interval = setInterval(()=>{
      fetchLocations();
    }, 5000);

    return ()=>clearInterval(interval)
  },[]);

  if (!isLoaded || !dataLoaded) {
    return <div>Loading...</div>
  }else{
    return (
      <div className={styles.container}>
        <ColectuberMap
          fetchedColectivos={colectivos}
          fetchedParadas={paradas}
        />
      </div>
    );
  }
}

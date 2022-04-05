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

  //FLAG
  const [dataLoaded, setDataLoaded] = useState(false);

  //DATOS
  const [colectivos, setColectivos] = useState([]);
  const [paradas, setParadas] = useState([]);
  const [recorridos, setRecorridos] = useState([]);

  const fetchAndSetInitialData = ()=>{
    ColectuberService.fetchInitialData()
      .then((initialData)=>{
        setColectivos(initialData.colectivos);
        setParadas(initialData.paradas);
        setRecorridos(initialData.recorridos);
        setDataLoaded(true);
      }).catch((err)=>{
        console.error(err);
      })
  }

  const fetchAndSetLocations = async ()=>{
    ColectuberService.fetchLocations()
      .then((newPositions)=>{
        setColectivos((prevColectivos)=>{
          let newColectivos = [...prevColectivos];
          ColectuberService.mergeColectivosWithLocations(newColectivos, newPositions)
          return newColectivos;
        })
      }).catch((err)=>{
        console.error(err);
      })
  }

  useEffect(()=>{
    fetchAndSetInitialData();

    const interval = setInterval(()=>{
      fetchAndSetLocations();
    }, 5000);

    return ()=>clearInterval(interval)
  },[]);

  //SELECT
  const [selectedMarker, setSelectedMarker] = useState(null);

  const selectMarker = (markerId)=>{
    setSelectedMarker(markerId);
  }


  if (!isLoaded || !dataLoaded) {
    return <div>Loading...</div>
  }else{
    return (
      <div className={styles.container}>
        <ColectuberMap
          //Data
          fetchedColectivos={colectivos}
          fetchedParadas={paradas}
          fetchedRecorridos={recorridos}

          //Selection
          selectedMarker={selectedMarker}
          selectMarker={selectMarker}
        />
      </div>
    );
  }
}

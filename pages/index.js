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

  //FLAGS
  const [dataLoaded, setDataLoaded] = useState(false);

  //DATOS
  const [colectivos, setColectivos] = useState([]);
  const [paradas, setParadas] = useState([]);

  const fetchInitialData = ()=>{
    ColectuberService.fetchInitialData()
      .then(res=>{
        setParadas(res.paradas);
        setColectivos(res.colectivos)
        setDataLoaded(true);
      })
      .catch(err=>console.error(err));
  }

  const fetchLocations = ()=>{
    ColectuberService.fetchLocations()
      .then((newPositions)=>{
        setColectivos((prevColectivos)=>{
          prevColectivos.forEach(colectivo=>{
            colectivo.position = newPositions.find(fp=>fp.id==colectivo.id)?.position;
          });
          return [...prevColectivos];
        });
      })
      .catch(err=>console.error(err));
  }

  useEffect(()=>{
    fetchInitialData();

    const interval = setInterval(()=>{
      fetchLocations();
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
          
          //Selection
          selectedMarker={selectedMarker}
          selectMarker={selectMarker}
        />
      </div>
    );
  }
}

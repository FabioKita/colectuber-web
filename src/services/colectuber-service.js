import API from "src/repositories/api";

const mergeColectivoWithLocation = (colectivo, location)=>{
    if (!colectivo) return;
    if (location){
        colectivo.position = location.position;
        colectivo.recorridoId = location.recorridoId;
        colectivo.ip = location.ip;
    }else{
        colectivo.position = undefined;
        colectivo.recorridoId = undefined;
        colectivo.ip = undefined;
    }
}

const mergeColectivosWithLocations = (colectivos, locations)=>{
    colectivos.forEach(colectivo=>{
        let location = locations.find(l=>l.colectivoId == colectivo.id);
        mergeColectivoWithLocation(colectivo, location);
    })
}

const fetchInitialData = async ()=>{
    let datos = {
        colectivos:[],
        paradas:[],
        recorridos:[]
    };

    let responce = await API.get("/colectuber/get-data");
    
    datos.colectivos = getColectivosList(responce.data);
    datos.paradas = getParadaList(responce.data);
    datos.recorridos = getRecorridosList(responce.data);

    console.log(datos);

    return datos;
}

const getColectivosList = (responceData)=>{
    let locations = responceData.colectivoUbicacion.map((l)=>parseDtoToLocations(l));

    let colectivos = responceData.colectivos.map(c=>{
        return {
            id:"c-"+c.id,
            number:c.numero,
            line:c.linea,
            company:c.empresa,
        };
    });

    mergeColectivosWithLocations(colectivos, locations);
    return colectivos;
}

const getParadaList = (responceData)=>{
    let paradas = responceData.paradas.map(p=>{
        return {
            id:"p-"+p.id,
            name:p.nombre,
            description:p.descripcion,
            image:p.image,
            position:{
                lat:p.posicion.latitud,
                lng:p.posicion.longitud
            }
        };
    })

    return paradas;
}

const getRecorridosList = (responceData)=>{
    let recorridos = responceData.recorridos.map(r=>{
        return {
            id:"r-"+r.id,
            name:r.nombre,
            description:r.descripcion,
            points:r.puntos.map(p=>({
                id:p.id,
                paradaId:p.paradaId,
                position:{
                    lat:p.puntoPosicion.latitud,
                    lng:p.puntoPosicion.longitud
                }
            })),
        };
    })

    return recorridos;
}

const fetchLocations = async ()=>{
    let responce = await API.get("/colectuber/ubicaciones");
    let fetchedLocations = responce.data.result.map((fetchedLocation)=>parseDtoToLocations(fetchedLocation))

    console.log(fetchedLocations);

    return fetchedLocations;
}

const parseDtoToLocations = (dto)=>{
    return {
        colectivoId: "c-" + dto.colectivoId,
        recorridoId: dto.recorrido_id,
        ip: dto.indicePorcentaje,
        position:{
            lat:dto.posicionColectivo.latitud,
            lng:dto.posicionColectivo.longitud
        }
    };
}

const ColectuberService = {
    fetchInitialData,
    fetchLocations,
    mergeColectivosWithLocations
};

export default ColectuberService;
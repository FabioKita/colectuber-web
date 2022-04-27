import API from "src/repositories/api";

const mergeColectivoWithLocation = (colectivo, location)=>{
    if (!colectivo) return;
    if (location){
        colectivo.position = location.position;
        colectivo.recorridoId = location.recorridoId;
        colectivo.ip = location.ip;
        colectivo.destination = location.destination;
    }else{
        colectivo.position = undefined;
        colectivo.recorridoId = undefined;
        colectivo.ip = undefined;
        colectivo.destination = undefined;
    }
}

const mergeColectivosWithLocations = (colectivos, locations)=>{
    colectivos.forEach(colectivo=>{
        let location = locations.find(l=>l.colectivoId == colectivo.id);
        mergeColectivoWithLocation(colectivo, location);
    })
}

const addPrefix=(value, prefix)=>{
    if(value){
        return prefix+value;
    }else{
        return value;
    }
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

    return datos;
}

const getColectivosList = (responceData)=>{
    let locations = responceData.colectivoUbicacion.map(l=>parseDtoToLocations(l));

    let colectivos = responceData.colectivos.map(c=>{
        return {
            id:addPrefix(c.id, "c-"),
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
            id:addPrefix(p.id, "p-"),
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
            id:addPrefix(r.id, "r-"),
            name:r.nombre,
            description:r.descripcion,
            points:r.puntos.map(p=>({
                id:p.id,
                paradaId: addPrefix(p.paradaId, "p-"),
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
    return fetchedLocations;
}

const parseDtoToLocations = (dto)=>{
    return {
        colectivoId: addPrefix(dto.colectivoId, "c-"),
        recorridoId: addPrefix(dto.recorrido_id, "r-"),
        ip: dto.indicePorcentaje,
        position:{
            lat:dto.posicionColectivo.latitud,
            lng:dto.posicionColectivo.longitud
        },
        destination:dto.destino
    };
}

const ColectuberService = {
    fetchInitialData,
    fetchLocations,
    mergeColectivosWithLocations
};

export default ColectuberService;
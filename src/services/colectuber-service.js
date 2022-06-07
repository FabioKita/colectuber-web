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
        colectivosData:[],
        paradas:[],
        recorridos:[]
    };

    let response = await API.get("/colectuber/get-data");

    datos.colectivos = getColectivosList(response.data);
    datos.colectivosData = getColectivosDatosList(response.data);
    datos.paradas = getParadaList(response.data);
    datos.recorridos = getRecorridosList(response.data);

    return datos;
}

const getColectivosList = (responseData)=>{
    let locations = responseData.colectivoUbicacion.map(l=>parseDtoToLocations(l));

    let colectivos = responseData.colectivos.map(c=>{
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

const getColectivosDatosList = (responseData)=>{
    let colectivosDatos = responseData.colectivoUbicacion.map(d=>parseDtoToLocations(d));

    return colectivosDatos;
}

const getParadaList = (responseData)=>{
    let paradas = responseData.paradas.map(p=>{
        return {
            id:addPrefix(p.id, "p-"),
            name:p.nombre,
            description:p.descripcion,
            image:p.image,
            zone:p.zona,
            position:{
                lat:p.posicion.latitud,
                lng:p.posicion.longitud
            }
        };
    })

    return paradas;
}

const getRecorridosList = (responseData)=>{
    let recorridos = responseData.recorridos.map(r=>{
        return {
            id:addPrefix(r.id, "r-"),
            name:r.nombre,
            description:r.descripcion,
            color:r.color,
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
    let response = await API.get("/colectuber/ubicaciones");
    let fetchedLocations = response.data.result.map((fetchedLocation)=>parseDtoToLocations(fetchedLocation))
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
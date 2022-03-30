import API from "src/repositories/api";

const fetchInitialData = async ()=>{
    let datos = {
        colectivos:[],
        paradas:[],
        recorridos:[]
    };

    //Paradas
    datos.paradas = await fetchParadas();

    //Colectivos
    datos.colectivos = await fetchColectivos();

    return datos;
}

const fetchColectivos = async ()=>{
    let locations = await fetchLocations();
    let fetchedColectivosData = await API.get("/colectivos");
    
    return await Promise.all(fetchedColectivosData.data.result.map(async (dto)=>{
        let id = "c-"+dto.id;
        let position = locations.find(pe=>pe.id===id)?.position;
        let linea = await fetchLinea(dto.lineaId);
        return {
            id:id,
            number:dto.numero,
            line:linea,
            position:position
        };
    }));
}

const fetchLinea = async (id)=>{
    let lineaData = await API.get(`/lineas_colectivos/${id}`);
    return {
        id:lineaData.data.id,
        number:lineaData.data.numero
    };
}

const fetchParadas = async ()=>{
    let fetchedParadasData = await API.get("/paradas");

    return fetchedParadasData.data.result.map((dto)=>{
        return {
            id:"p-" + dto.id,
            name:dto.nombre,
            description:dto.descripcion,
            image:dto.image,
            position:{
                lat:dto.latitud,
                lng:dto.longitud
            }
        };
    })
}

const fetchLocations = async ()=>{
    let responce = await API.get("/colectuber/ubicaciones");
    return responce.data.result.map((dto)=>{
        return {
            id:"c-" + dto.colectivoId,
            position:{
                lat:dto.posicionColectivo.latitud,
                lng:dto.posicionColectivo.longitud
            }
        };
    });
}

const ColectuberService = {
    fetchInitialData,
    fetchLocations
};

export default ColectuberService;
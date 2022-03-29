import API from "src/repositories/api";

const fetchInitialData = async ()=>{
    let datos = {
        colectivos:[],
        paradas:[],
        recorridos:[],
        ubicaciones:[]
    };

    //Paradas
    let fetchedParadasData = await API.get("/paradas");
    datos.paradas = fetchedParadasData.data.result.map((dto)=>{
        return {
            id:dto.id,
            name:dto.nombre,
            description:dto.descripcion,
            image:dto.image,
            position:{
                lat:dto.latitud,
                lng:dto.longitud
            }
        };
    });

    //Ubicaciones
    datos.ubicaciones = await fetchLocations();
    
    return datos;
}

const fetchLocations = async ()=>{
    let responce = await API.get("/colectuber/ubicaciones");
    return responce.data.result.map((dto)=>{
        return {
            id:dto.colectivoId,
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
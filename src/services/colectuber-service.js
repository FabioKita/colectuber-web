import API from "src/repositories/api";

const fetchLocations = async ()=>{
    let responce = await API.get("/colectuber/ubicaciones");
    return responce.data.listaColectivoUbicaciones.map((dto)=>{
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
    fetchLocations:fetchLocations
};

export default ColectuberService;
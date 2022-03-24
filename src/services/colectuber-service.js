import API from "src/repository/api";

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

const colectuberService = {
    fetchLocations:fetchLocations
};

export default colectuberService;
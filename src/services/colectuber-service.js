import API from "src/repositories/api";

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
    let colectivos = responceData.colectivos.map(c=>{
        let ubicacionDto = responceData.colectivoUbicacion.find(cu=>cu.colectivoId == c.id);

        let position = undefined;

        if (ubicacionDto){
            position = {
                lat:ubicacionDto.posicionColectivo.latitud,
                lng:ubicacionDto.posicionColectivo.longitud
            };
        }

        return {
            id:"c-"+c.id,
            number:c.numero,
            line:c.linea,
            company:c.empresa,
            position:position
        };
    });

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
export default class ParadaMapEntity{
    constructor(data){
        this.id = data.id;
        this.name = data.name,
        this.description = data.description,
        this.image = data.image,
        this.zone = data.zone,
        this.position = {
            lat: data.position.lat,
            lng: data.position.lng
        }
    }

    getParadasBeforeParada(recorridos){
        let paradaList = [];
        Object.values(recorridos).forEach((recorrido)=>{
            if(!recorrido.hasParada(this)) return;
            paradaList = [...paradaList, ...recorrido.getParadasBeforeParada(this)];
        })
        return paradaList;
    }
}
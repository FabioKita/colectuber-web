const AVERAGE_SPEED = 10;

export default class ColectivoDatosMapEntity{
    constructor(data, recorridos){
        this.colectivoId = data.colectivoId;
        this.destination = data.destination;
        this.recorrido = recorridos[data.recorridoId];
        this.ip = data.ip;
        //Para calculos
        this.distanceFromStart = this.recorrido.ipDistance(0, this.ip);
    }

    //Selection Method
    isColectivoBeforeParada(paradaId){
        return this.recorrido.isParadaAfterIp(paradaId, this.ip);
    }

    getDistanceToParada(paradaId){
        return this.recorrido.getDistanceToParada(paradaId, this.distanceFromStart)*100000;
    }

    getDistanceAndTimeToParada(paradaId){
        let distance = this.getDistanceToParada(paradaId);
        let time = distance/AVERAGE_SPEED;
        return [distance, time];
    }

    getParadasAfterColectivo(){
        return this.recorrido.getParadasAfterIp(this.ip);
    }
}
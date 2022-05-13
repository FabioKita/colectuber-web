const TIMER = 5000;
const AVERAGE_SPEED = 10;

export default class ColectivoMapEntity{
    constructor(data, recorridos){
        this.id = data.id;
        
        //Info window data
        this.number = data.number;
        this.line = data.line;
        this.company = data.company;

        //Position and Interpolation Variables
        this.destination = data.destination;
        this.recorrido = recorridos[data.recorridoId];

        if(!this.recorrido) return;

        this.ip = data.ip;
        this.ip_from = data.ip;
        this.ip_to = data.ip;
        this.ip_delta = this.recorrido.ipDistance(this.ip_from, this.ip_to);

        this.position = this.recorrido.ipPosition(this.ip);
        this.distanceFromStart = this.recorrido.ipDistance(0, this.ip);

        this.timer = 0;
    }

    update(data, recorridos){
        let newIp = data.ip;
        let newRecorrido = recorridos[data.recorridoId];

        if(this.ip_to != newIp || this.recorrido != newRecorrido){
            this.destination = data.destination;
            this.recorrido = newRecorrido;

            if(!this.recorrido) return;

            this.ip_from = this.ip;
            this.ip_to = newIp;
            this.ip_delta = this.recorrido.ipDistance(this.ip_from, this.ip_to);

            this.position = this.recorrido.ipPosition(this.ip);
            this.timer = TIMER;
        }
    }

    isValid(){
        if(!this.id) return false;
        if(!this.recorrido) return false;
        if(isNaN(this.ip)) return false;
        return true;
    }

    step(delta){
        if(this.isValid()){
            this.move(delta);
        }
    }

    move(delta){
        if (this.timer > 0){
            this.timer -= delta;
            let p = this._clamp(1 - this.timer/TIMER, 0, 1);
            this.ip = this.recorrido.ipOffset(this.ip_from, this.ip_delta*p);
            this.distanceFromStart = this.recorrido.ipDistance(0, this.ip)
        }else{
            this.ip = this.ip_to;
        }
        this.position = this.recorrido.ipPosition(this.ip);
    }

    //Selection Method
    isInterpolationFinished(){
        return this.timer <= 0;
    }

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
    
    //Auxiliar method
    _lerp(i, f, p){
        return i + (f-i)*p;
    }

    _clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }
}
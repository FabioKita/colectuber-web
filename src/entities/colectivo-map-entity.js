const TIMER = 5000;

export default class ColectivoMapEntity{
    constructor(data, recorrido){
        this.id = data.id;
        
        //Info window data
        this.number = data.number;
        this.line = data.line;
        this.company = data.company;

        //Position and Interpolation Variables
        this.ip = data.ip;
        this.ip_from = data.ip;
        this.ip_to = data.ip;
        this.recorrido = recorrido;

        this.position = this.recorrido.ipPosition(this.ip);

        this.timer = 0;
    }

    update(data, recorrido){
        let newIp = data.ip;
        let newRecorrido = recorrido;

        if(this.ip_to != newIp || this.recorrido != newRecorrido){
            this.recorrido = newRecorrido;
            this.ip_from = this.ip;
            this.ip_to = newIp;
            this.position = this.recorrido.ipPosition(this.ip);
            this.timer = TIMER;
        }
    }

    step(delta){
        this.move(delta);
    }

    move(delta){
        if (this.timer > 0){
            this.timer -= delta;
            let p = this._clamp(1 - this.timer/TIMER, 0, 1);
            let dist = this.recorrido.ipDistance(this.ip_from, this.ip_to);
            this.ip = this.recorrido.ipOffset(this.ip_from, dist*p);
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
        return this.recorrido.getDistanceToParada(paradaId, this.ip)
    }
    
    //Auxiliar method
    _lerp(i, f, p){
        return i + (f-i)*p;
    }

    _clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }
}
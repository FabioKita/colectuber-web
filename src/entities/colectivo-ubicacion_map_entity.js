const TIMER = 5000;

export default class ColectivoUbicacionMapEntity{
    constructor(data, recorridos){
        this.update(data, recorridos);
    }

    update(data, recorridos){
        let id = data.colectivoId + "-" + data.recorridoId;
        if(!this.id || this.id != id){
            this.id = id;
            this.colectivoId = data.colectivoId;
            this.recorrido = recorridos[data.recorridoId];
            this.ip = data.ip;
            this.ip_from = data.ip;
            this.ip_to = data.ip;
            this.ip_delta = this.recorrido.ipDistance(this.ip_from, this.ip_to);
            this.position = this.recorrido.ipPosition(this.ip);
            this.timer = 0;
        }else{
            this.ip_from = this.ip;
            this.ip_to = data.ip;
            this.ip_delta = this.recorrido.ipDistance(this.ip_from, this.ip_to);
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
            this.ip = this.recorrido.ipOffset(this.ip_from, this.ip_delta*p);
            this.distanceFromStart = this.recorrido.ipDistance(0, this.ip)
        }else{
            this.ip = this.ip_to;
        }
        this.position = this.recorrido.ipPosition(this.ip);
    }
    
    //Auxiliar method
    _lerp(i, f, p){
        return i + (f-i)*p;
    }

    _clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }
}
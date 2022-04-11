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

        this.position = this._ipPosition(this.ip, this.recorrido);

        this.timer = 0;
    }

    update(data, recorrido){
        let newIp = data.ip;
        let newRecorrido = recorrido;

        if(this.ip_to != newIp || this.recorrido != newRecorrido){
            this.recorrido = newRecorrido;
            this.ip_from = this.ip;
            this.ip_to = newIp;
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
            let dist = this._ipDistance(this.ip_from, this.ip_to, this.recorrido);
            this.ip = this._ipOffset(this.ip_from, dist*p, this.recorrido);
        }else{
            this.ip = this.ip_to;
        }
        this.position = this._ipPosition(this.ip, this.recorrido);
    }

    //Auxiliar method
    _lerp(i, f, p){
        return i + (f-i)*p;
    }

    _clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }

    _clampIp(ip, recorrido){
        return this._clamp(ip, 0, recorrido.getPath().length-1);
    }

    _ipPosition(ip, recorrido){
        ip = this._clampIp(ip, recorrido);
        let index = Math.trunc(ip);
        let per = ip-index;
        let nextIndex = this._clampIp(index+1, recorrido);

        let path = recorrido.getPath();
        let newPosition = {
            lat:this._lerp(path[index].lat(), path[nextIndex].lat(), per),
            lng:this._lerp(path[index].lng(), path[nextIndex].lng(), per)
        };

        return new google.maps.LatLng(newPosition);
    }

    _ipDistanceDirect(ip1, ip2, recorrido){
        let p1 = this._ipPosition(ip1, recorrido);
        let p2 = this._ipPosition(ip2, recorrido);
        
        let dlat = p1.lat()-p2.lat();
        let dlng = p1.lng()-p2.lng();
        return Math.sqrt(dlat*dlat + dlng*dlng) * Math.sign(ip2-ip1);
    }

    _ipDistance(ip1, ip2, recorrido){
        //Si esta en la misma recta, devolver la distancia directa
        if(Math.trunc(ip1) == Math.trunc(ip2)){
            return this._ipDistanceDirect(ip1, ip2, recorrido);
        }

        //Si no esta en la misma recta, usar recurcion
        let dir = Math.sign(ip2-ip1);
        let nextIp = dir > 0 ? Math.floor(ip1) + 1 : Math.ceil(ip1) - 1;
        return this._ipDistanceDirect(ip1, nextIp, recorrido) + this._ipDistance(nextIp, ip2, recorrido);
    }

    _ipOffset(ip, offset, recorrido){
        const __ipOffset = (index, offset, recorrido)=>{
            let dir = Math.sign(offset);
            let nextIndex = this._clampIp(index+dir, recorrido);
            if(index == nextIndex) return index;

            let indexDistNextIndex = this._ipDistanceDirect(index, nextIndex, recorrido);
            if(Math.abs(indexDistNextIndex) > Math.abs(offset)){
                let per = offset/indexDistNextIndex;
                return this._clampIp(index+per*dir, recorrido);
            }else{
                return __ipOffset(nextIndex, offset-indexDistNextIndex, recorrido);
            }
        }

        ip = this._clampIp(ip, recorrido);
        let dir = Math.sign(offset);
        let index;
        
        if(dir > 0) index = Math.floor(ip);
        else if (dir < 0) index = Math.ceil(ip);
        else return ip;

        let ipDistIndex = this._ipDistanceDirect(index, ip, recorrido);
        return __ipOffset(index, offset + ipDistIndex, recorrido);
    }

    
}
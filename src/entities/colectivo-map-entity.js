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

        this.position = this._getPositionFromIp(this.ip, this.recorrido);

        this.timer = 0;
    }

    update(data, recorrido){
        this.recorrido = recorrido;
        let newIp = data.ip;

        if(this.ip == newIp) return;
        this.ip_from = this.ip;
        this.ip_to = newIp;
        this.timer = TIMER;

        //debug
        let dist = this._getDistanceIp(this.ip_from, this.ip_to, this.recorrido);
        console.log(this._getDistanceIpDirect(this.ip_from, this.ip_to, this.recorrido), dist);
        console.log(this._addOffsetIp(this.ip_from, dist, this.recorrido), this.ip_to);
    }

    step(delta){
        this.move(delta);
    }

    move(delta){
        if (this.timer > 0){
            this.timer -= delta;
            let p = this._clamp(1 - this.timer/TIMER, 0, 1);

            let total_dist = this._getDistanceIp(this.ip_from, this.ip_to, this.recorrido);
            this.ip = this._addOffsetIp(this.ip_from, total_dist*p, this.recorrido);
            this.position = this._getPositionFromIp(this.ip, this.recorrido);
        }
    }

    //Auxiliar method
    _lerp(i, f, p){
        return i + (f-i)*p;
    }

    _clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }

    _separateIp(ip){
        let index = Math.trunc(ip);
        let per = ip-index;
        return [index, per];
    }

    _getPositionFromIp(ip, recorrido){
        let path = recorrido.getPath();
        
        let [index, per] = this._separateIp(ip);
        let nextIndex = this._clamp(index+1, 0, path.length-1);

        let new_position = {
            lat: this._lerp(path[index].lat(), path[nextIndex].lat(), per),
            lng: this._lerp(path[index].lng(), path[nextIndex].lng(), per),
        };

        return new google.maps.LatLng(new_position);
    }

    _getDistanceIpDirect(ip1, ip2, recorrido){
        let p1 = this._getPositionFromIp(ip1, recorrido);
        let p2 = this._getPositionFromIp(ip2, recorrido);
        let dlat = p1.lat() - p2.lat();
        let dlng = p1.lng() - p2.lng();
        return Math.sqrt(dlat*dlat + dlng*dlng) * Math.sign(ip2 - ip1);
    }

    _getDistanceIp(ip1, ip2, recorrido){
        let dir = Math.sign(ip2 - ip1);
        if(Math.trunc(ip1) == Math.trunc(ip2)){
            return this._getDistanceIpDirect(ip1, ip2, recorrido);
        }
        //No esta en la misma recta;
        else if (dir > 0){
            let nextIp = Math.floor(ip1) + 1;
            return this._getDistanceIpDirect(ip1, nextIp, recorrido) + this._getDistanceIp(nextIp, ip2, recorrido);
        }else if(dir < 0){
            let nextIp = Math.ceil(ip1) - 1;
            return this._getDistanceIpDirect(ip1, nextIp, recorrido) + this._getDistanceIp(nextIp, ip2, recorrido);
        }else{
            return 0;
        }
    }

    _addOffsetIp(ip, distance, recorrido){
        let dir = Math.sign(distance);
        if(dir > 0){
            let nextIp = Math.floor(ip) + 1;
            let distToNext = this._getDistanceIpDirect(ip, nextIp, recorrido);
            if(distToNext > distance){
                let index = Math.floor(ip);
                let distIndexToRes = this._getDistanceIpDirect(index, ip, recorrido) + distance;
                let distIndexToNext = this._getDistanceIpDirect(index, nextIp, recorrido);
                let per = distIndexToRes/distIndexToNext;
                let resIp = this._clamp(index + per, 0, recorrido.getPath().length-1);
                return this._truncate(resIp, 15);
            }else{
                return this._addOffsetIp(nextIp, distance-distToNext, recorrido);
            }
        }else if(dir < 0){
            let nextIp = Math.ceil(ip) - 1;
            let distToNext = this._getDistanceIpDirect(ip, nextIp, recorrido);
            if(distToNext < distance){
                let index = Math.ceil(ip);
                let distIndexToRes = this._getDistanceIpDirect(index, ip, recorrido) + distance;
                let distIndexToNext = this._getDistanceIpDirect(index, nextIp, recorrido);
                let per = distIndexToRes/distIndexToNext;
                let resIp = this._clamp(index - per, 0, recorrido.getPath().length-1);
                return this._truncate(resIp, 15);
            }else{
                return this._addOffsetIp(nextIp, distance-distToNext, recorrido);
            }
        }else{
            return ip;
        }
    }

    _truncate(n, decimals){
        let ten_power = Math.pow(10, decimals);
        return Math.trunc(n*ten_power)/ten_power;
    }
}
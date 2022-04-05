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

        this.position = this.getPositionFromIp(this.ip, this.recorrido);

        this.timer = 0;
    }

    update(data, recorrido){
        this.recorrido = recorrido;
        let newIp = data.ip;

        if(this.ip == newIp) return;
        this.ip_from = this.ip;
        this.ip_to = newIp;
        this.timer = TIMER;
    }

    step(delta){
        this.move(delta);
    }

    move(delta){
        if (this.timer > 0){
            this.timer -= delta;
            let p = this.clamp(1 - this.timer/TIMER, 0, 1);

            this.ip = this.lerp(this.ip_from, this.ip_to, p);
            this.position = this.getPositionFromIp(this.ip, this.recorrido);
        }
    }

    //Auxiliar method
    lerp(i, f, p){
        return i + (f-i)*p;
    }

    clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }

    separateIp(ip){
        let index = Math.trunc(ip);
        let per = ip-index;
        return [index, per];
    }

    getPositionFromIp(ip, recorrido){
        let path = recorrido.getPath();
        
        let [index, per] = this.separateIp(ip);
        let nextIndex = this.clamp(index+1, 0, path.length-1);

        let new_position = {
            lat: this.lerp(path[index].lat(), path[nextIndex].lat(), per),
            lng: this.lerp(path[index].lng(), path[nextIndex].lng(), per),
        };

        return new google.maps.LatLng(new_position);
    }
}
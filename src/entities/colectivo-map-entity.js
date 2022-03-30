const TIMER = 5000;

export default class ColectivoMapEntity{
    constructor(data){
        this.id = data.id;
        
        this.number = data.number;
        this.line = data.line;

        //Position and Interpolation Variables
        this.position = new google.maps.LatLng(data.position);
        this.position_from = new google.maps.LatLng(data.position);
        this.position_to = new google.maps.LatLng(data.position);
        this.timer = 0;
    }

    update(data){
        let newPos = new google.maps.LatLng(data.position);
        if(this.position_to.equals(newPos)) return;

        this.position_from = this.position;
        this.position_to = newPos;
        this.timer = TIMER;
    }

    move(delta){
        const lerp = (i, f, p)=>{
            return i + (f-i)*p;
        }

        const clamp = (n, min, max)=>{
            return Math.max(min, Math.min(max, n))
        }

        if (this.timer > 0){
            this.timer -= delta;

            let p = clamp(1 - this.timer/TIMER, 0, 1);

            this.position = new google.maps.LatLng({
                lat: lerp(this.position_from.lat(), this.position_to.lat(), p),
                lng: lerp(this.position_from.lng(), this.position_to.lng(), p),
            });
        }
    }
}
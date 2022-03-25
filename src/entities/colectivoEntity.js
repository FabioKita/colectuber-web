const TIMER = 5000;

export default class ColectivoEntity{
    constructor(id, initialPos){
        this.id = id;
        this.position = new google.maps.LatLng(initialPos);
        this.position_from = new google.maps.LatLng(initialPos);
        this.position_to = new google.maps.LatLng(initialPos);
        this.timer = 0;
    }

    updatePosition(new_position){
        let newPos = new google.maps.LatLng(new_position);
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
            let p = clamp(1 - this.timer/TIMER, 0, 1);

            this.position = new google.maps.LatLng({
                lat: lerp(this.position_from.lat(), this.position_to.lat(), p),
                lng: lerp(this.position_from.lng(), this.position_to.lng(), p),
            });

            this.timer -= delta;
        }
    }
}
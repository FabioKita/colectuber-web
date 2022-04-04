const TIMER = 5000;
const OPACITY_SPEED = 0.1;

export default class ColectivoMapEntity{
    constructor(data){
        this.id = data.id;
        
        this.number = data.number;
        this.line = data.line;
        this.company = data.company;

        //Position and Interpolation Variables
        this.position = new google.maps.LatLng(data.position);
        this.position_from = new google.maps.LatLng(data.position);
        this.position_to = new google.maps.LatLng(data.position);
        this.timer = 0;

        //Opacity
        this.opacity = 1;
        this.opacityTo = 1;
    }

    update(data){
        let newPos = new google.maps.LatLng(data.position);
        if(this.position_to.equals(newPos)) return;

        this.position_from = this.position;
        this.position_to = newPos;
        this.timer = TIMER;
    }

    step(delta){
        this.move(delta);
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

    interpolateOpacity(delta){
        const approach = (i, f, a)=>{
            if (i < f) return Math.min(i+a, f);
            else return Math.max(i-a, f);
        }

        if(this.opacity != this.opacityTo){
            this.opacity = approach(this.opacity, this.opacityTo, OPACITY_SPEED);
        }
    }
}
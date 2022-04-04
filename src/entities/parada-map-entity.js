export default class ParadaMapEntity{
    constructor(data){
        this.id = data.id;
        this.name = data.name,
        this.description = data.description,
        this.image = data.image,
        this.position = {
            lat: data.position.lat,
            lng: data.position.lng
        }

        //Opacity
        this.opacity = 1;
        this.opacityTo = 1;
    }
    
    step(delta){
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
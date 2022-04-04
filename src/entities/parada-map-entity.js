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
}
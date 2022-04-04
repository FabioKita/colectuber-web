export default class RecorridoMapEntity{
    constructor(data){
        this.id = data.id,
        this.name = data.name,
        this.description = data.description,
        this.points = data.points.map((dataPoint)=>{
            return {
                id:dataPoint.id,
                paradaId:dataPoint.paradaId,
                position:dataPoint.position
            };
        })
        this.path = this.points.map((point)=>{
            return new google.maps.LatLng({
                lat:point.position.lat,
                lng:point.position.lng
            });
        })

        //Opacity
        this.opacity = 1;
        this.opacityTo = 1;
    }

    step(delta){
    }

    getPath(){
        return this.path;
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
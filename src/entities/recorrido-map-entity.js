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
    }

    step(delta){
        
    }

    getPath(){
        return this.path;
    }
}
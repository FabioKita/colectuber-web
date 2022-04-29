export default class UserMapEntity{
    constructor(data){
        this.position = {
            lat: data.position.lat,
            lng: data.position.lng
        }
    }

    update(data){
        this.position = {
            lat: data.position.lat,
            lng: data.position.lng
        }
    }
}
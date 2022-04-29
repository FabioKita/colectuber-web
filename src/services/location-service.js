const isLocationAvailable = ()=>{
    return "geolocation" in navigator;
}

const _askPermissions = ()=>{
    return new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

const askPermissions = async ()=>{
    let result = await navigator.permissions.query({name:'geolocation'});
    if(result.state == "granted") return;
    if(result.state == "denied") throw new Error("Permission not granted.")
    if(result.state == "prompt"){
        let permission = await _askPermissions();
        return permission;
    }
}

const startLocationTracking = (onGetPosition, onError=()=>{})=>{
    if(!isLocationAvailable()) return null;
    console.log("Location Tracking started");
    return navigator.geolocation.watchPosition(
        (position)=>{
            let ret = {
                lat:position.coords.latitude,
                lng:position.coords.longitude
            };
            onGetPosition(ret);
        },
        onError,
        {
            enableHighAccuracy: false
        }
    );
}

const stopLocationTracking = (id)=>{
    if(id == null) return;
    navigator.geolocation.clearWatch(id);
    console.log("Location Tracking stopped");
}

const LocationService = {
    askPermissions,
    isLocationAvailable,
    startLocationTracking,
    stopLocationTracking
}

export default LocationService;
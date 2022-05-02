const _getLocation = ()=>{
    return new Promise((resolve, reject)=>{
        navigator.geolocation.getCurrentPosition(resolve, reject);
    })
}

const askPermissions = async ()=>{
    let result = await navigator.permissions.query({name:'geolocation'});
    if(result.state == "granted") return;
    if(result.state == "denied") throw new Error("Permission not granted.")
    if(result.state == "prompt"){
        await _getLocation();
    }
}

const startLocationTracking = (onGetLocation, onError)=>{
    return navigator.geolocation.watchPosition(
        (position)=>{
            let result = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
            onGetLocation(result);
        },
        (error)=>{
            onError(error);
        },
        {
            enableHighAccuracy:true,
            timeout:5000,
            maximumAge:60000
        }
    )
}

const stopLocationTracking = (id)=>{
    if(!id) return;
    navigator.geolocation.stopLocationTracking(id);
}

const LocationService = {
    askPermissions,
    startLocationTracking,
    stopLocationTracking
}

export default LocationService;
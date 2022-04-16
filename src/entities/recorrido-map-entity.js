export default class RecorridoMapEntity{
    constructor(data, paradas){
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        
        this.points = data.points.map((dataPoint)=>{
            let parada = dataPoint.paradaId?paradas[dataPoint.paradaId]:undefined;
            return {
                id:dataPoint.id,
                parada:parada,
                position:dataPoint.position
            };
        })
        
        this.path = this.points.map((point)=>{
            return new google.maps.LatLng({
                lat:point.position.lat,
                lng:point.position.lng
            });
        })

        //Parada Map
        const getPathToIp = (ip)=>{
            const _getPathToIp = (currentIp, finalIp)=>{
                if(currentIp >= finalIp){
                    return [this.ipPosition(finalIp)]
                }else{
                    let nextIp = this._clampIp(Math.floor(currentIp)+1);
                    return [this.ipPosition(currentIp), ..._getPathToIp(nextIp, finalIp)];
                }
            }
            return _getPathToIp(0, ip);
        }

        this.paradas = {};
        this.points.forEach((point, index)=>{
            if(point.parada){
                this.paradas[point.parada.id] = {
                    parada:point.parada,
                    ip:index,
                    path:getPathToIp(index)
                };
            }
        })
    }

    //SelectionMethod
    getPathWithRelatedEntity(relatedEntity){
        const getPathfromIp = (ip)=>{
            ip = this._clampIp(ip);
            let nextIp = this._clampIp(Math.floor(ip)+1);
            let position = this.ipPosition(ip);
            if(nextIp == ip){
                return [position]
            }else{
                return [position, ...getPathfromIp(nextIp)];
            }
        }

        if(!relatedEntity){
            return this.path;
        }else if(relatedEntity.id.startsWith("c-")){
            //Es un colectivo
            return getPathfromIp(relatedEntity.ip);
        }else if(relatedEntity.id.startsWith("p-")){
            //Es una parada
            return this.paradas[relatedEntity.id].path;
        }else{
            return this.path;
        }
    }

    isParadaAfterIp(paradaId, ip){
        let paradaInfo = this.paradas[paradaId];
        if(!paradaInfo) return false;
        return paradaInfo.ip > ip;
    }

    getDistanceToParada(paradaId, ip){
        let paradaInfo = this.paradas[paradaId];
        if(!paradaInfo) return false;
        return this.ipDistance(ip, paradaInfo.ip);
    }

    //IP Methods
    ipPosition(ip){
        ip = this._clampIp(ip);
        let index = Math.trunc(ip);
        let per = ip-index;
        let nextIndex = this._clampIp(index+1);

        let path = this.path;
        let newPosition = {
            lat:this._lerp(path[index].lat(), path[nextIndex].lat(), per),
            lng:this._lerp(path[index].lng(), path[nextIndex].lng(), per)
        };

        return new google.maps.LatLng(newPosition);
    }

    ipDistance(ip1, ip2){
        //Si esta en la misma recta, devolver la distancia directa
        if(Math.trunc(ip1) == Math.trunc(ip2)){
            return this._ipDistanceDirect(ip1, ip2);
        }

        //Si no esta en la misma recta, usar recurcion
        let dir = Math.sign(ip2-ip1);
        let nextIp = dir > 0 ? Math.floor(ip1) + 1 : Math.ceil(ip1) - 1;
        return this._ipDistanceDirect(ip1, nextIp) + this.ipDistance(nextIp, ip2);
    }
    
    ipOffset(ip, offset){
        const _ipOffset = (index, offset)=>{
            let dir = Math.sign(offset);
            let nextIndex = this._clampIp(index+dir);
            if(index == nextIndex) return index;

            let indexDistNextIndex = this._ipDistanceDirect(index, nextIndex);
            if(Math.abs(indexDistNextIndex) > Math.abs(offset)){
                let per = offset/indexDistNextIndex;
                return this._clampIp(index+per*dir);
            }else{
                return _ipOffset(nextIndex, offset-indexDistNextIndex);
            }
        }

        ip = this._clampIp(ip);
        let dir = Math.sign(offset);
        let index;
        
        if(dir > 0) index = Math.floor(ip);
        else if (dir < 0) index = Math.ceil(ip);
        else return ip;

        let ipDistIndex = this._ipDistanceDirect(index, ip);
        return _ipOffset(index, offset + ipDistIndex);
    }

    //Auxiliar Method
    _lerp(i, f, p){
        return i + (f-i)*p;
    }

    _clamp(n, min, max){
        return Math.max(min, Math.min(max, n))
    }

    _clampIp(ip){
        return this._clamp(ip, 0, this.path.length-1);
    }

    //formula de esta pagina https://www.movable-type.co.uk/scripts/latlong.html
    _haversine(p1, p2){
        let lat1 = p1.lat();
        let lng1 = p1.lng();
        let lat2 = p2.lat();
        let lng2 = p2.lng();

        const R = 6371e3; // metres
        const φ1 = lat1 * Math.PI/180; // φ, λ in radians
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lng2-lng1) * Math.PI/180;
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; // in metres

        return d;
    }

    _ipDistanceDirect(ip1, ip2){
        let p1 = this.ipPosition(ip1);
        let p2 = this.ipPosition(ip2);
        /*
        let dlat = p1.lat()-p2.lat();
        let dlng = p1.lng()-p2.lng();
        return Math.sqrt(dlat*dlat + dlng*dlng) * Math.sign(ip2-ip1);
        */
       return this._haversine(p1, p2) * Math.sign(ip2-ip1);
    }
}
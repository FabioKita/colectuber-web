export default class ColectivoMapEntity{
    constructor(data, recorridos){
        this.id = data.id;
        
        //Info window data
        this.number = data.number;
        this.line = data.line;
        this.company = data.company;
    }
}
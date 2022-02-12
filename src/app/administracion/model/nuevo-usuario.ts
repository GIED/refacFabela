export class NuevoUsuario {
    nId:number;
    sClaveUser:string;
    sUsuario:string;
    sPassword:string;
    sNombreUsuario:string;
    nEstatus:number;
    roles:string[];
    rfcDistribuidor:string;

    constructor(nId:number, sClaveUser:string, sUsuario:string, sPassword:string, sNombreUsuario: string, nEstatus:number, rfcDistribuidor:string) {
        this.nId = nId;
        this.sClaveUser=sClaveUser;
        this.sUsuario=sUsuario;
        this.sPassword=sPassword;
        this.sNombreUsuario=sNombreUsuario;
        this.nEstatus=nEstatus;
        this.rfcDistribuidor=rfcDistribuidor;
        
    }
}

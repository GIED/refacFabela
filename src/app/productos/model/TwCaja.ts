
import { Usuarios } from '../../administracion/interfaces/usuarios';
export class TwCaja {
    nId?:number;
    dFechaApertura?:Date;
    dFechaCierre?:Date;
    nEstatus?:number;
    nPagoEfectivo?:number;
    nPagoElectronico?:number;
    nSaldoCierre?:number;
    nSaldoFinal?:number;
    nSaldoInicial?:number;
    nIdUsuario?:number;
    tcUsuario?:Usuarios;
   
}
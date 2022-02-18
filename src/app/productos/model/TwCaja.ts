
import { Usuarios } from '../../administracion/interfaces/usuarios';
export class TwCaja {
    nId?:number;
    d_fechaApertura?:Date;
    d_fechaCierre?:Date;
    nEstatus?:number;
    n_pagoEfectivo?:number;
    n_pagoElectronico?:number;
    n_saldoCierre?:number;
    n_saldoFinal?:number;
    n_saldoInicial?:number;
    tcUsuario?:Usuarios;
   
}
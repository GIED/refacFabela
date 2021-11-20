import { TcFormaPago } from './TcFormaPago';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TwVenta } from './TwVenta';
export class TwAbono{

    nId?: number;
    nIdVenta?:number
    dFecha?: Date;
    nAbono?:number
    nEstatus?:number;
    tcFormapago?:TcFormaPago;
    tcUsuario?:Usuarios
    twVenta?:TwVenta;
        
       

}
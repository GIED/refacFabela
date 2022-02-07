import { TcFormaPago } from './TcFormaPago';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TwVenta } from './TwVenta';
import { TwCaja } from './TwCaja';
export class TwAbono{

    nId?: number;
    nIdVenta?:number
    dFecha?: Date;
    nAbono?:number
    nEstatus?:number;
    tcFormapago?:TcFormaPago;
    tcUsuario?:Usuarios
    twVenta?:TwVenta;
    twCaja?:TwCaja;
        
       

}
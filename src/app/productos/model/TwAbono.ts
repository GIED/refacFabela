import { TcFormaPago } from './TcFormaPago';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TwVenta } from './TwVenta';
import { TwCaja } from './TwCaja';
import Decimal from 'decimal.js';
export class TwAbono{

    nId?: number;
    nIdVenta?:number
    dFecha?: Date;
    nAbono?:Decimal
    nEstatus?:number;
    tcFormapago?:TcFormaPago;
    tcUsuario?:Usuarios
    twVenta?:TwVenta;
    twCaja?:TwCaja;
        
       

}
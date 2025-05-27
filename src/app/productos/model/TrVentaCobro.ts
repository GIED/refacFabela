import { TwCaja } from './TwCaja';
import { TwVenta } from './TwVenta';
import { TcFormaPago } from './TcFormaPago';
import Decimal from 'decimal.js';
export class TrVentaCobro{
    nId:number;
    nIdVenta:number;
    nIdCaja:number;
    nMonto:Decimal;
    dFecha:Date;
    nEstatus:number;
    nIdFormaPago:number;
    twCaja: TwCaja;
    twVenta:TwVenta;
    tcFormapago: TcFormaPago;
}
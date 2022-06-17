import { TwCaja } from './TwCaja';
import { TwVenta } from './TwVenta';
import { TcFormaPago } from './TcFormaPago';
export class TrVentaCobro{
    nId:number;
    nIdVenta:number;
    nIdCaja:number;
    nMonto:number;
    dFecha:Date;
    nEstatus:number;
    nIdFormaPago:number;
    twCaja: TwCaja;
    twVenta:TwVenta;
    tcFormapago: TcFormaPago;
}
import { TwCaja } from './TwCaja';
import { TwVenta } from './TwVenta';
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
}
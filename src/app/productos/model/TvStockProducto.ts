import Decimal from 'decimal.js';
import { TcProducto } from './TcProducto';
export class TvStockProducto{
    nIdProducto: number;
    nCantidadTotal?: number;
    nCantidad?:number;
    tcProducto: TcProducto;
    nStatus?:number;
    nTipoPago?:number;
    nIdProveedor?:number;
    nTotalUnitario?:Decimal=new Decimal(0);
    nTotalPartida?:Decimal=new Decimal(0);
}
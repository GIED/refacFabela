import { TwVenta } from './TwVenta';
import { TcProducto } from './TcProducto';
export class TvVentaStock{

        nIdVenta:number;
        nIdProducto:number;
        nCantidad:number;
        dFechaVenta: Date;
        nCantidadTotal:number;
        twVenta:TwVenta;
        tcProducto:TcProducto;

}
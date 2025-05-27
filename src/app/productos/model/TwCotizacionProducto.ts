import Decimal from "decimal.js";
import { TwCotizacion } from "./TcCotizacion";
import { TcProducto } from "./TcProducto";

export class TwCotizacionProducto{

    nId?:number;
    nIdProducto?:number;
    nIdCotizacion?:number;   
    nCantidad?:number;
    nIvaPartida?:Decimal;
    nPrecioPartida?:Decimal;
    nPrecioUnitario?:Decimal;
    nTotalPartida?:Decimal;
    nTotalUnitario?:Decimal;
    sCondicionEntrega?:string;
    nIdDescuento:number;
    tcProducto?:TcProducto
    twCotizaciones?:TwCotizacion;




}
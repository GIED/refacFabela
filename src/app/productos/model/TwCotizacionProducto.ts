import { TwCotizacion } from "./TcCotizacion";
import { TcProducto } from "./TcProducto";

export class TwCotizacionProducto{

    nId?:number;
    nIdProducto?:number;
    nIdCotizacion?:number;   
    nCantidad?:number;
    nIvaPartida?:number;
    nPrecioPartida?:number;
    nPrecioUnitario?:number;
    nTotalPartida?:number;
    nTotalUnitario?:number;
    sCondicionEntrega?:string;
    tcProducto?:TcProducto
    twCotizaciones?:TwCotizacion;




}
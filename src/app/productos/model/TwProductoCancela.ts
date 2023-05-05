import { TcUsuario } from "src/app/administracion/model/TcUsuario";
import { TwCaja } from "./TwCaja";
import { TwVenta } from "./TwVenta";

export class TwProductoCancela{

    nId:number;
    nIdVenta:number;
    nIdProductos:number;
    nCantidad:number;
    nPrecioUnitario:number;
    nIvaUnitario:number;
    nTotalUnitario:number;
    nPrecioPartida:number;
    nIdUsuario:number;
    dFecha:number;
    nIdCaja:number;
    twCaja:TwCaja
    tcUsuario:TcUsuario;
    twVenta:TwVenta;


}
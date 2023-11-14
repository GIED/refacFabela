import { TcUsuario } from "src/app/administracion/model/TcUsuario";
import { TcProducto } from "./TcProducto";
import { TwVenta } from "./TwVenta";

export class TwVentasProducto{

    nId:number;
    nIdVenta:number;
    nIdProducto:number;
    nIdUsuario:number;
    dFechaEntregaAlmacen:Date;
    dFechaEntregaEstimada:Date;
    nCantidad:number;
    nEstatusEntregaAlmacen:number;
    nIvaPartida:number;
    nIvaUnitario:number;
    nPrecioPartida:number;
    nPrecioUnitario:number;
    nTotalPartida:number;
    nTotalUnitario:number;
    nEstatus:number;
    sCondicionEntrega:string;
    nIdDescuento:number;
    tcProducto:TcProducto;
    tcUsuario: TcUsuario;
    twVenta: TwVenta;

}
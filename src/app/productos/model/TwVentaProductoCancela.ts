import { Usuarios } from "src/app/administracion/interfaces/usuarios"
import { TwCaja } from "./TwCaja"
import { TwVenta } from "./TwVenta"
import { TcProducto } from "./TcProducto"

export class TwVentaProductoCancela{

    nId:number
    nIdVenta:number
    nIdProductos:number
    nCantidad:number
    nPrecioUnitario:number
    nIvaUnitario:number
    nTotalUnitario:number
    nPrecioPartida:number
    nIdUsuario:number
    dFecha:Date
    nIdCaja:number
    twCaja:TwCaja
    tcUsuario:Usuarios
    twVenta:TwVenta
    tcProducto:TcProducto
	

}
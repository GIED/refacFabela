import { Proveedores } from "src/app/administracion/interfaces/proveedores";
import { TcUsuario } from "src/app/administracion/model/TcUsuario";
import { TcProducto } from "./TcProducto";

export class TwPedidoProducto{
    nId:number
    sClavePedido:string; 
    dFechaPedido: Date;
    nMotivoPedido:number;
    nIdProducto: number;
    nCantidadPedida:number;
    nIdProveedor: number;
    nCantidaRecibida:number;
    dFechaRecibida: Date;
    nEstatus:number;
    sObservaciones: string;
    nIdUsuario:number;
    tcProducto: TcProducto;
    tcProveedore:Proveedores;
    tcUsuario: TcUsuario;  

}
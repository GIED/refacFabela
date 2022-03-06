import { TwPedidoProducto } from "./TwPedidoProducto";

export class PedidoDto{
    nId:number;	
    nIdUsuario:number;
    sCvePedido:string;
    dFechaPedido:Date;
    sObservaciones:string;
    nEstatus:number;
    dFechaPedidoCierre:Date;	
  twPedidoProducto: TwPedidoProducto[];
}
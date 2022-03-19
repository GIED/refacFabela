import { TcProducto } from './TcProducto';
import { TcUsuario } from '../../administracion/model/TcUsuario';
import { TwPedido } from './TwPedido';
import { TcBodega } from './TcBodega';
export class TwHistoriaIngresoProducto{ 
    nId:number;
    nIdPedido: number;
    nIdBodega: number;
    nIdProducto: number;
    nCantidad: number;
    nIdUsuario: number;
    dFechaingreso: Date;
    tcProducto: TcProducto;
    tcUsuario: TcUsuario;
    twPedido: TwPedido;
    tcBodega: TcBodega;
}
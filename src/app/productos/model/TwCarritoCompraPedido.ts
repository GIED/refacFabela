import { TcProducto } from './TcProducto';
import { TcUsuario } from '../../administracion/model/TcUsuario';
import { Usuarios } from 'src/app/administracion/interfaces/usuarios';
export class TwCarritoCompraPedido{
    nId: number;
    nIdUsuario: number;
    nIdPedido: number;
    nIdProducto: number;
    nCantidad: number;
    dFechaRegistro: Date;
    dFechaLlegada: Date;
    nEstatus: number;
    TcProducto:TcProducto;
    TcUsuario:Usuarios;
}
import { TcProducto } from './TcProducto';
import { TcUsuario } from '../../administracion/model/TcUsuario';
import { Usuarios } from 'src/app/administracion/interfaces/usuarios';
import { Proveedores } from 'src/app/administracion/interfaces/proveedores';
export class TwCarritoCompraPedido{
    nId: number;
    nIdUsuario: number;
    nIdPedido: number;
    nIdProducto: number;
    nCantidad: number;
    dFechaRegistro: Date;
    dFechaLlegada: Date;
    nEstatus: number;
    nIdProveedor:number;
    TcProducto:TcProducto;
    TcUsuario:Usuarios;
    TcProveedor:Proveedores;
    estaEnUltimaCompra:boolean;

}
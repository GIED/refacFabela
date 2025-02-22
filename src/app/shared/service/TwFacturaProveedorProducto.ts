import { TcUsuario } from "src/app/administracion/model/TcUsuario";
import { TcMarca } from "src/app/productos/model/TcMarca";
import { TcProducto } from "src/app/productos/model/TcProducto";

export class  TwFacturaProveedorProducto {
    nId: number;
    nIdFacturaProveedor: number;
    nIdProducto: number;
    nIdUsuario: number;
    nCantidad: number;
    dFechaRegistro: Date;
    dFechaCierreIngreso: Date;
    nIdMarca: number;
    nPrecioUnitario: number;
    nEstatus: number;
    sMotivoCierre: string;
    tcProducto?: TcProducto;
    tcUsuario?: TcUsuario;
    tcMarca?: TcMarca;
}
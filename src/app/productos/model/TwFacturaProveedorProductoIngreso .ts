import { TwFacturaProveedorProducto } from "src/app/shared/service/TwFacturaProveedorProducto";
import { TcBodega } from "./TcBodega";
import { TcAnaquel } from "./TcAnaquel";
import { TcNivel } from "./TcNivel";
import { TcUsuario } from "src/app/administracion/model/TcUsuario";

export class TwFacturaProveedorProductoIngreso {

    nId: number;
    nIdFacturaProveedorProducto: number;
    nCantidad: number;
    nIdUsuario: number;
    dFechaIngreso: Date;
    nEstatus: number;
    nIdBodega: number;
    nIdAnaquel: number;
    nIdNivel: number;
    twFacturaProveedorProducto: TwFacturaProveedorProducto;
    tcBodega: TcBodega;
    tcAnaquel: TcAnaquel;
    tcNivel: TcNivel;
    tcUsuario: TcUsuario;


}
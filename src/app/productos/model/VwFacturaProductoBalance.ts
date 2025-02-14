import { Proveedores } from "src/app/administracion/interfaces/proveedores";
import { TcUsuario } from "src/app/administracion/model/TcUsuario";
import { TcMoneda } from "./TcMoneda";
import { Model } from "src/app/shared/utils/model";

export class VwFacturaProductoBalance implements Model{

    nId: number;
    sFolioFactura: string;
    nIdProveedor: number;
    nIdUsuario: number;
    nIdMoneda: number;
    nIdRazonSocial: number;
    dFechaInicioFactura: Date;
    nEstatusFacturaProveedor: number;
    nEstatusIngresoAlmacen: number;
    nTotalProductos: number;
    nTotalNoParte: number;
    tcProveedor: Proveedores;
    tcUsuario: TcUsuario;
    tcMoneda: TcMoneda;

}
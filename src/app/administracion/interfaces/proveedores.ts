import { TcTipoProveedor } from "./TcTipoProveedor";

export interface Proveedores {
 
    nId?: number;
    nEstatus?: number;
    nIdusuario?: number;
    sDireccion?: string;
    sRazonSocial?: string;
    sRfc?: string;
    sTelefono?: string;
    nIdTipoProveedor?:number;
    tcTipoProveedor?:TcTipoProveedor;
}

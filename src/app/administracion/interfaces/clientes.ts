import { TcCp } from 'src/app/productos/model/TcCp';
import { TcRegimenFiscal } from '../../productos/model/TcRegimenFiscal';
import Decimal from 'decimal.js';
export interface Clientes {
   
    nId?: number;
    d_fechaCredito?: Date;
    nEstatus?: number;
    n_idUsuarioCredito?: number;
    n_limiteCredito?: Decimal;
    sCorreo?: string;
    sDireccion?: string;
    sRazonSocial?: string;
    sRfc?: string;
    sTelefono?: string;
    sClave?:string;
    nCp?:number;
    tcRegimenFiscal?:TcRegimenFiscal;
    nDescuento?:number;
    nIdDatoFactura?:number;
    nDatosValidados?:boolean;
    tcCp?:TcCp;
}

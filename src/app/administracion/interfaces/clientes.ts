import { TcCp } from 'src/app/productos/model/TcCp';
import { TcRegimenFiscal } from '../../productos/model/TcRegimenFiscal';
import Decimal from 'decimal.js';
import { Model } from 'src/app/shared/utils/model';
export class Clientes implements Model{
   
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

import Decimal from "decimal.js";

export class TcCliente{
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
}
import { Clientes } from '../../administracion/interfaces/clientes';
import { TcTipoVenta } from './TcTipoVenta';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TwCaja } from './TwCaja';
import { TcFormaPago } from './TcFormaPago';
export class TwVenta{

    nId?: number;
    nIdCliente?:number;
    nIdUsuario?:number;
    sFolioVenta?: string;
    dFechaVenta?: Date;
    nIdEstatusVenta?:number;
    nIdFacturacion?: number;
    nIdTipoVenta?:number;
    nTipoPago?:number;
    nIdCaja?:number;
    dFechaInicioCredito?:Date;
    dFechaTerminoCredito?:Date;
    dFechaPagoCredito?:Date;
    credito?:number;
    tcCliente?:Clientes
    tcTipoVenta?:TcTipoVenta;
    tcUsuario?:Usuarios;
    twCaja?:TwCaja
    tcFormapago?: TcFormaPago;
    nSaldo?:boolean;
    nIdFormaPago?:number;
    nAnticipo?:number;



}
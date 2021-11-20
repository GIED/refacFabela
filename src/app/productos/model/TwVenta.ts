import { Clientes } from '../../administracion/interfaces/clientes';
import { TcTipoVenta } from './TcTipoVenta';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TwCaja } from './TwCaja';
export class TwVenta{

    nId?: number;
    nIdCliente?:number;
    nIdUsuario?:number;
    sFolioVenta?: string;
    dFechaVenta?: Date;
    nEstatusVenta?:number;
    nIdFacturacion?: number;
    nIdTipoVenta?:number;
    nTipoPago?:number;
    nIdCaja?:number;
    dFechaInicioCredito?:Date;
    dFechaPagoCredito?:Date;
    tcCliente?:Clientes
    tcTipoVenta?:TcTipoVenta;
    tcUsuario?:Usuarios;
    twCaja?:TwCaja



}
import { Clientes } from '../../administracion/interfaces/clientes';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TcEstatusVenta } from './TcEstatusVenta';
import { TcFormaPago } from './TcFormaPago';
import { TwCaja } from './TwCaja';
import { TcTipoVenta } from './TcTipoVenta';
export class TvVentasFactura{

nId?:number;
nIdCliente?:number;
nIdUsuario?:number;
sFolioVenta?:string;
dFechaVenta?:Date;
nTipoPago?:number;
nEstatus?:number;
nIdTipoVenta?:number;
formaPago?:number;
idCaja: number;
idFactura: number;
nTotalVenta: number;
tcCliente?:Clientes;
tcUsuario?:Usuarios;
tcEstatusVenta?:TcEstatusVenta;
tcFormapago?:TcFormaPago;
twCaja?:TwCaja;
tcTipoVenta?: TcTipoVenta;
    
}
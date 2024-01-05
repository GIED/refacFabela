import { Clientes } from '../../administracion/interfaces/clientes';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TcEstatusVenta } from './TcEstatusVenta';
import { TcFormaPago } from './TcFormaPago';
import { TwCaja } from './TwCaja';
import { TcTipoVenta } from './TcTipoVenta';
export class TvVentasDetalle{

nId?:number;
nIdCliente?:number;
nIdUsuario?:number;
sFolioVenta?:string;
dFechaVenta?:Date;
nTipoPago?:number;
nIdTipoVenta?:number;
dFechaInicioCredito?:Date;
dFechaTerminoCredito?:Date;
dFechaPagoCredito?:Date;
nTotalVenta?:number;
nTotalAbono?:number;
nSaldoTotal?:number;
nAvancePago?:number;
nAnticipo?:number;
sEstatus?:string;
tcCliente?:Clientes;
tcUsuario?:Usuarios;
tcEstatusVenta?:TcEstatusVenta;
descuento?:number;
tcFormapago?:TcFormaPago;
twCaja?:TwCaja;
tcTipoVenta?: TcTipoVenta;
nSaldoFavor?:number;
nIdVentaUtilizado?:number;
nSaldo?:boolean;
nVencido?:boolean;
    
}
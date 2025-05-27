import { Clientes } from '../../administracion/interfaces/clientes';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TcEstatusVenta } from './TcEstatusVenta';
import { TcFormaPago } from './TcFormaPago';
import { TwCaja } from './TwCaja';
import { TcTipoVenta } from './TcTipoVenta';
import Decimal from 'decimal.js';
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
nTotalVenta?:Decimal;
nTotalAbono?:Decimal;
nSaldoTotal?:Decimal;
nAvancePago?:number;
nAnticipo?:Decimal;
sEstatus?:string;
tcCliente?:Clientes;
tcUsuario?:Usuarios;
tcEstatusVenta?:TcEstatusVenta;
descuento?:Decimal;
tcFormapago?:TcFormaPago;
twCaja?:TwCaja;
tcTipoVenta?: TcTipoVenta;
nSaldoFavor?:number;
nIdVentaUtilizado?:number;
nSaldo?:boolean;
nVencido?:boolean;
    
}
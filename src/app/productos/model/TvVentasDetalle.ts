import { Clientes } from '../../administracion/interfaces/clientes';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TcEstatusVenta } from './TcEstatusVenta';
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
nFotalVenta?:number;
nTotalAbono?:number;
nSaldoTotal?:number;
nAvancePago?:number;
sEstatus?:string;
tcCliente?:Clientes;
tcUsuario?:Usuarios;
tcEstatusVenta?:TcEstatusVenta;


    
}
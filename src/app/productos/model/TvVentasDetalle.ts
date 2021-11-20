import { Clientes } from '../../administracion/interfaces/clientes';
import { Usuarios } from '../../administracion/interfaces/usuarios';
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
nFotalAbono?:number;
nFaldoTotal?:number;
nFvancePago?:number;
sEstatus?:string;
tcCliente?:Clientes;
tcUsuario?:Usuarios;


    
}
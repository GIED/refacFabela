import { Clientes } from '../../administracion/interfaces/clientes';
import { Usuarios } from '../../administracion/interfaces/usuarios';
export class TvVentasDetalle{

n_id?:number;
n_idCliente?:number;
n_idUsuario?:number;
s_folioVenta?:string;
d_fechaVenta?:Date;
n_tipoPago?:number;
n_idTipoVenta?:number;
d_fechaInicioCredito?:Date;
d_fechaTerminoCredito?:Date;
d_fechaPagoCredito?:Date;
n_totalVenta?:number;
n_totalAbono?:number;
n_saldoTotal?:number;
n_avancePago?:number;
s_estatus?:string;
tcCliente?:Clientes;
tcUsuario?:Usuarios;


    
}
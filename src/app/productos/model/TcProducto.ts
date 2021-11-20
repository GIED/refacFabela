import { TcCategoria } from './TcCategoria';
import { TcCategoriaGeneral } from './TcCategoriaGeneral';
import { TcGanancia } from './TcGanancia';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TcClavesat } from './TcClavesat';
export class TcProducto{
nId: number;
dFecha: Date;
nEstatus: number;
nIdCategoriaGeneral:number;
nIdCategoria:number;
nPrecio: number;
sDescripcion: string; 
sMarca: string;
sMoneda: string;
sNoParte: string;
sProducto :string;
nIdusuario:number;
nIdGanancia:number;
nIdclavesat:number;
tcCategoria: TcCategoria; 
tcCategoriaGeneral: TcCategoriaGeneral; 
tcGanancia: TcGanancia;
tcUsuario: Usuarios;
tcClavesat: TcClavesat;
nPrecioPeso:number;
nPrecioSinIva:number;
nPrecioConIva:number;
}
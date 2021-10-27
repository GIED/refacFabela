import { TcCategoria } from './TcCategoria';
import { TcCategoriaGeneral } from './TcCategoriaGeneral';
import { TcGanancia } from './TcGanancia';
import { Usuarios } from '../../administracion/interfaces/usuarios';
import { TcClavesat } from './TcClavesat';
export class TcProducto{
nId: number;
sNoParte: string;
sProducto :string;
sDescripcion: string; 
sMarca: string;
tcCategoria: TcCategoria; 
tcCategoriaGeneral: TcCategoriaGeneral; 
nPrecio: number;
sMoneda: string;
tcGanancia: TcGanancia;
tcUsuario: Usuarios;
nEstatus: number; 
dFecha: Date;
tcClavesat: TcClavesat;
}
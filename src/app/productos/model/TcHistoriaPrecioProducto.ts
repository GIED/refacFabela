import { TcUsuario } from './../../administracion/model/TcUsuario';
import { TcGanancia } from './TcGanancia';
import { TcProducto } from './TcProducto';
export class TcHistoriaPrecioProducto{
 
	 nId?:number;	
	 nIdProducto?:number;	
	nPrecio?:number;	
	sMoneda?:string;	
	 nIdGanancia?:number;
	 nIdusuario?:number;
	 dFecha?:Date;
     tcGanancia: TcGanancia;
     tcUsuario: TcUsuario;
     tcProducto: TcProducto

}
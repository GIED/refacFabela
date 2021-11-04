import { TcProducto } from './TcProducto';
import { TcAnaquel } from './TcAnaquel';
import { TcBodega } from './TcBodega';
import { TcNivel } from './TcNivel';
export class TwProductoBodega{
    nId:number;
	
	nIdBodega:number;
	
	nIdProducto:number;	

	nCantidad: number;

	nEstatus: number;
	
	nIdNivel: number;
	
	nIdAnaquel: number;

    tcAnaquel: TcAnaquel;

    tcBodega:TcBodega;
    
    tcNivel:TcNivel;
    
    tcProducto:TcProducto;

	
}
import { TcProducto } from './TcProducto';
import { TcAnaquel } from './TcAnaquel';
import { TcBodega } from './TcBodega';
import { TcNivel } from './TcNivel';
import { Model } from '../../shared/utils/model';
export class TwProductoBodega implements Model{
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
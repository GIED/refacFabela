import { TcProducto } from './TcProducto';
import { TcAnaquel } from './TcAnaquel';
import { TcBodega } from './TcBodega';
import { TcNivel } from './TcNivel';
import { Model } from '../../shared/utils/model';
export class TwProductoBodegaDto implements Model{
	
	nIdBodegaActual:number;

	nCantidadActual: number;

	nIdBodegaDestino:number;

	nCantidadDestino: number;

}
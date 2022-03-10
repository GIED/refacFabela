import { Model } from 'src/app/shared/utils/model';
import { TwCotizacion } from '../../productos/model/TcCotizacion';
import { TcCliente } from '../../administracion/model/TcCliente';
export class TwPagoComprobanteInternet implements Model{

    nId: number;
	nIdCotizacion:number;
	nIdCliente:number;
	sComprobante:string;
    nStatus:number;
	sObservaciones:string;
	dFechaCarga:Date;
	fFechaValidacion:Date;
	twCotizacionesDetalle:TwCotizacion;
	tcCliente:TcCliente;
	
	


}
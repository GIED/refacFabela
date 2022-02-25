import { TwCotizacion } from '../../productos/model/TcCotizacion';
export class TwPagoComprobanteInternet{

    nId: number;
	nIdCotizacion:number;
	nIdCliente:number;
	sComprobante:string;
    nStatus:number;
	twCotizacionesDetalle:TwCotizacion=new TwCotizacion();


}
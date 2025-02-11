import Decimal from "decimal.js";
import { TcMoneda } from "./TcMoneda";
import { TcUsuario } from "src/app/administracion/model/TcUsuario";

export class TwFacturasProveedor{
     nId:number;	
	 sFolioFactura:string;	
	 nIdProveedor:number;	
     dFechaInicioFactura:Date;	
	 dFechaTerminoFactura:Date;	
	 nIdUsuario:number;	
	 nEstatusFacturaProveedor:number;	
     dFechaPagoFactura:Date;	
	 nMontoFactura:number;	
	 nIdMoneda:number;	
	 sNota:string;
	 nIdRazonSocial:number;
	 nEspecial:boolean;
	 nEstatusIngresoAlmacen:boolean;
	 tcMoneda:TcMoneda;
	 tcUsuario:TcUsuario;
	 
}
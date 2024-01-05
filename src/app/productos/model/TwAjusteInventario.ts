import { TcUsuario } from "src/app/administracion/model/TcUsuario";
import { TcProducto } from "./TcProducto";
import { TcAnaquel } from "./TcAnaquel";
import { TcNivel } from "./TcNivel";

export class TwAjusteInventario{
     
    nId:number;    	
	nIdProducto:number;
    nIdBodega:number;	
	nIdNivel:number;	
	nCantidadAnterior:number;	
    nCantidadActual:number;	
	nTotalAjustado:number;	
    nIdUsuario:number;	
	sFecha:Date;
    tcUsuario:TcUsuario;	
	tcProducto:TcProducto;	
    tcAnaquel:TcAnaquel;	
	tcNivel:TcNivel;
	nIdAnaquel:number;
	sMotivo:string;

    

}
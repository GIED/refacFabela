import { IdBalalce } from "./IdBalalce";
import { Proveedores } from '../../administracion/interfaces/proveedores';

export class VwFacturasBalanceProveedor{

   id:IdBalalce;
   sMoneda:string;
   totalFacturas:number;
   totalAbonos:number;
   saldoPendientePago:number;
   totalPorPagar:number;
   totalVencidas:number;
   tcProveedore:Proveedores


}
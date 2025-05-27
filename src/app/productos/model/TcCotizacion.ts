import { Usuarios } from 'src/app/administracion/interfaces/usuarios';
import { TcCliente } from '../../administracion/model/TcCliente';
import Decimal from 'decimal.js';

export class TwCotizacion{
    nId?: number;
    nIdCliente?:number;
    nIdUsuario?:number;
    dFecha?:Date;
    nEstatus?: number;
    sFolioCotizacion?:string;
    tcCliente: TcCliente = new TcCliente();  
    tcUsuario?: Usuarios;
    nTotalCotizacion:Decimal;
    n_Vigencia:number;
    
}
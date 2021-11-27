import { Usuarios } from 'src/app/administracion/interfaces/usuarios';
import { TcCliente } from '../../administracion/model/TcCliente';

export class TwCotizacion{
    nId?: number;
    nIdCliente?:number;
    nIdUsuario?:number;
    dFecha?:Date;
    nEstatus?: number;
    sFolioCotizacion?:string;
    tcCliente?: TcCliente  
    tcUsuario?: Usuarios;
    nTotalCotizacion:number;
    n_Vigencia:number;
    
}
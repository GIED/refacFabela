import { Usuarios } from 'src/app/administracion/interfaces/usuarios';
import { Clientes } from '../../administracion/interfaces/clientes';

export class TwCotizacion{
    nId?: number;
    nIdCliente?:number;
    nIdUsuario?:number;
    dFecha?:Date;
    nEstatus?: number;
    nTotalCotizacion:number;
    n_Vigencia:number;
    sFolioCotizacion?:string;
    tcCliente?:    Clientes  
    tcUsuario?: Usuarios;
}
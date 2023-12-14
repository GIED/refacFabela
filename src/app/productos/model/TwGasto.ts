import { Usuarios } from "src/app/administracion/interfaces/usuarios";
import { TwCaja } from "./TwCaja";
import { TcGasto } from "./TcGasto";

export class TwGasto {

    nId: number;
    nIdCaja: number;
    nIdGasto: number;
    sDescripcion: string;
    dFecha: Date;
    nEstatus: number;
    nIdUsuario: number;
    tcUsuario: Usuarios
    twCaja: TwCaja;
    tcGasto: TcGasto;
    nMonto:number;

}
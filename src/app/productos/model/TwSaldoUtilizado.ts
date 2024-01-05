import { TwCaja } from "./TwCaja";
import { TwVenta } from "./TwVenta";

export class TwSaldoUtilizado {

    nId: number;
    nIdVenta: number;
    nSaldoTotal: number
    nSaldoUtilizado: number
    nIdUsuario: number;
    nEstatus: Boolean;
    dFecha: Date;
    nIdCaja: number;
    nIdVentaUtilizado: number;
    twVenta: TwVenta;
    twCaja: TwCaja;
    twVentaUtilizado: TwVenta;
}
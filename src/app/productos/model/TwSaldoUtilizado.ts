import Decimal from "decimal.js";
import { TwCaja } from "./TwCaja";
import { TwVenta } from "./TwVenta";

export class TwSaldoUtilizado {

    nId: number;
    nIdVenta: number;
    nSaldoTotal: Decimal
    nSaldoUtilizado: Decimal
    nIdUsuario: number;
    nEstatus: Boolean;
    dFecha: Date;
    nIdCaja: number;
    nIdVentaUtilizado: number;
    twVenta: TwVenta;
    twCaja: TwCaja;
    twVentaUtilizado: TwVenta;
}
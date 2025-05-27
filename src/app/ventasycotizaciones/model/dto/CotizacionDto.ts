import Decimal from "decimal.js";

export class CotizacionDto{
    nIdCliente: number;
    nIdUsuario:number;
    nIdProducto:number;
    nCantidad:number;
    nPrecioUnitario:Decimal;
    nIvaUnitario:Decimal;
    nTotalUnitario:Decimal;
    sFolio: string;
    nInDescuento:number;
}
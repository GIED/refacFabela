import { TvStockProducto } from "src/app/productos/model/TvStockProducto";

export interface DatosVenta{
    idCliente?:number;
    idUsuario?:number;
    sFolioVenta?:string;
    idTipoVenta?:number;
    tipoPago?: number;
    fechaIniCredito?: Date;
    fechaFinCredito?:Date;
    listaValidada?: TvStockProducto[];
}
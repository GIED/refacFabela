import { TwProductoBodega } from './TwProductoBodega';
export class VwMetaProductoCompra {
    nId!: number;
    sNoParte!: string;
    sProducto!: string;
    sDescripcion!: string;
    sMarca!: string;
    sCategoria!: string;
    sCategoriaGeneral!: string;
    sClavesat!: string;
    sIdBar!: string;
    nIdDescuento!: number;
    nPrecio!: number; // BigDecimal en Java se mapea a number en TypeScript
    sMoneda!: string;
    nGanancia!: number;
    nPrecioUnitarioCalculado!: number;
    nIvaUnitarioCalculado!: number;
    nTotalUnitarioCalculado!: number;
    nCantidad!: number;
    nStockMinimoRequerido!: number;
    nStockMaximoRequerido!: number;
    dUltimaFechaCompra!: Date;
    nStockSugerido!: number;
    nSugerenciaCompra!: number;
    TwProductoBodega!: TwProductoBodega[];
  }
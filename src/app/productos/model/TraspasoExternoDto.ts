/**
 * DTO para movimiento externo de mercancía entre bodegas.
 * Solo envía los IDs y la cantidad; la aritmética se hace en el backend.
 */
export class TraspasoExternoDto {

    nIdProducto: number;

    nIdBodegaOrigen: number;

    nIdBodegaDestino: number;

    nCantidad: number;

}

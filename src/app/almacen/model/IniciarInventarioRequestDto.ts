/**
 * DTO para la petición de inicio de inventario por ubicación.
 */
export class IniciarInventarioRequestDto {
    nIdBodega?: number;
    nIdAnaquel?: number;
    nIdNivel?: number;
    sObservaciones?: string;
}

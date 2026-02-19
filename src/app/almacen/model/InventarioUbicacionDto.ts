/**
 * DTO completo del inventario por ubicación con su detalle.
 */
export class InventarioUbicacionDto {
    nId?: number;
    nIdBodega?: number;
    sBodega?: string;
    nIdAnaquel?: number;
    sAnaquel?: string;
    nIdNivel?: number;
    sNivel?: string;
    nEstatus?: number;
    sDescripcionEstatus?: string;
    dInicio?: Date;
    dUltimaActividad?: Date;
    dCierre?: Date;
    nIdUsuarioResponsable?: number;
    sNombreUsuarioResponsable?: string;
    nIdUsuarioCierra?: number;
    sNombreUsuarioCierra?: string;
    nIdUsuarioAutoriza?: number;
    sNombreUsuarioAutoriza?: string;
    dAutorizacion?: Date;
    sMotivoAutorizacion?: string;
    sObservaciones?: string;
    
    // Estadísticas calculadas
    totalLineas?: number;
    lineasPendientes?: number;
    lineasContadas?: number;
    lineasRecontar?: number;

    // Mensaje temporal de sincronización
    sMensajeSincronizacion?: string;

    // Detalle de productos
    detalle?: InventarioUbicacionDetalleDto[];
}

/**
 * DTO para el detalle de productos en un inventario por ubicación.
 */
export class InventarioUbicacionDetalleDto {
    nId?: number;
    nIdInventario?: number;
    nIdProducto?: number;
    sNoParte?: string;
    sNombreProducto?: string;
    sMarca?: string;
    nCantidadTeoricaIni?: number;
    nCantidadTeoricaRef?: number;
    dRefActualizada?: Date;
    nCantidadContada?: number;
    nEstatusLinea?: number;
    sDescripcionEstatusLinea?: string;
    dCaptura?: Date;
    nIdUsuarioCaptura?: number;
    sNombreUsuarioCaptura?: string;
    sObservacion?: string;
    
    // Campos de ajuste individual
    bAjustado?: boolean;
    sMotivoAjuste?: string;
    dFechaAjuste?: Date;
    nIdUsuarioAjuste?: number;
    sNombreUsuarioAjuste?: string;
    
    // Campos calculados
    nDiferencia?: number; // contada - ref
}

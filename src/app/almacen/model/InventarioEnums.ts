/**
 * Constantes de estatus del inventario por ubicación.
 */
export enum EstatusInventario {
    ABIERTO = 1,
    PAUSADO = 2,
    EN_REVISION = 3,
    AUTORIZADO = 4,
    APLICADO = 5,
    CANCELADO = 6
}

/**
 * Constantes de estatus de línea del inventario.
 */
export enum EstatusLineaInventario {
    PENDIENTE = 1,
    CONTADO = 2,
    RECONTAR = 3
}

/**
 * Descriptores de estatus para UI.
 */
export const DESCRIPCION_ESTATUS_INVENTARIO = {
    1: 'ABIERTO',
    2: 'PAUSADO',
    3: 'EN REVISIÓN',
    4: 'AUTORIZADO',
    5: 'APLICADO',
    6: 'CANCELADO'
};

export const DESCRIPCION_ESTATUS_LINEA = {
    1: 'PENDIENTE',
    2: 'CONTADO',
    3: 'RECONTAR'
};

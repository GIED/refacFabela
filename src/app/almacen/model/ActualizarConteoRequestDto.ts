/**
 * DTO para actualizar el conteo de un producto específico en el inventario.
 */
export class ActualizarConteoRequestDto {
    nCantidadContada?: number;
    sObservacion?: string;
    sMotivo?: string; // Para auditoría
}

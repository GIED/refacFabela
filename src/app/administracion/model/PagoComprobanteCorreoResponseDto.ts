export class PagoComprobanteCorreoResponseDto {
  nIdPagoCliente?: number;
  correoDestino?: string;
  enviado?: boolean;
  bloqueado?: boolean;
  detalle?: string;
}
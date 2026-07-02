export class ResultadoFacturacionVentaDto {
  success?: boolean;
  mensaje?: string;
  avisoCorreo?: string;
  clasificacionFiscal?: string;
  metodoPagoFiscal?: string;
  formaPagoFiscal?: string;
  uuidFacturaIngreso?: string;
  uuidComplementoPago?: string;
  estadoFacturacion?: string;
  estadoComplemento?: string;
  codigoError?: string;
  mensajeError?: string;
}
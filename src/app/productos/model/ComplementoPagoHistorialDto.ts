export class ComplementoPagoHistorialDto {
  nId?: number;
  nIdVenta?: number;
  nIdFacturacion?: number;
  uuidFacturaIngreso?: string;
  uuidComplementoPago?: string;
  origenPago?: string;
  nIdPagoOrigen?: number;
  parcialidad?: number;
  formaPagoSat?: string;
  descripcionFormaPago?: string;
  montoPagado?: number;
  saldoAnterior?: number;
  saldoInsoluto?: number;
  fechaPago?: Date;
  proveedor?: string;
  estado?: string;
  estatus?: number;
  codigoError?: string;
  errorPac?: string;
  correlationId?: string;
  fechaRegistro?: Date;
}

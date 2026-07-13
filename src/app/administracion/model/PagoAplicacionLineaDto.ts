export class PagoAplicacionLineaDto {
  nId?: number;
  nIdPagoCliente?: number;
  nIdVenta?: number;
  nIdFacturacion?: number;
  montoAplicado?: number;
  saldoAnterior?: number;
  saldoInsoluto?: number;
  parcialidad?: number;
  estatus?: string;
  ordenAplicacion?: number;
  origenRegistro?: string;
  fechaPago?: Date;
  fechaAplicacion?: Date;
  formaPagoSat?: string;
  descripcionFormaPago?: string;
  referenciaPago?: string;
  observacionesPago?: string;
}
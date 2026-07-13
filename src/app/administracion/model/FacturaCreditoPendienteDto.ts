export class FacturaCreditoPendienteDto {
  nIdVenta?: number;
  nIdFacturacion?: number;
  folioVenta?: string;
  fechaVenta?: Date;
  totalVenta?: number;
  totalAplicado?: number;
  saldoPendiente?: number;
  parcialidadActual?: number;
  facturada?: boolean;
  requiereFacturacion?: boolean;
  estadoFiscal?: string;
  montoAplicarSeleccionado?: number;
}
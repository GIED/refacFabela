import { PagoAplicacionLineaDto } from './PagoAplicacionLineaDto';

export class PagoAplicacionResultadoDto {
  nIdPagoCliente?: number;
  importeTotal?: number;
  importeAplicado?: number;
  importeDisponible?: number;
  estatusPago?: string;
  aplicaciones?: PagoAplicacionLineaDto[];
}
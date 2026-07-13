import { PagoAplicacionManualLineaDto } from './PagoAplicacionManualLineaDto';

export class PagoAplicacionManualRequestDto {
  nIdUsuario?: number;
  origenRegistro?: string;
  lineas?: PagoAplicacionManualLineaDto[];
}
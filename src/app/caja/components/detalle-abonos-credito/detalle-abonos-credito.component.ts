import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PagoAplicacionLineaDto } from 'src/app/administracion/model/PagoAplicacionLineaDto';
import { TwAbono } from 'src/app/productos/model/TwAbono';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';

@Component({
  selector: 'app-detalle-abonos-credito',
  templateUrl: './detalle-abonos-credito.component.html',
  styleUrls: ['./detalle-abonos-credito.component.scss']
})
export class DetalleAbonosCreditoComponent implements OnInit {

  @Input() listaAbonosVenta: TwAbono[];
  @Input() listaAplicacionesCanonicasVenta: PagoAplicacionLineaDto[];
  @Input() tvVentasDetalle: TvVentasDetalle;

  @Output() refrescarSaldosCliete: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() solicitarPagoGlobal: EventEmitter<void> = new EventEmitter<void>();

  constructor() {
    this.listaAbonosVenta = [];
    this.listaAplicacionesCanonicasVenta = [];
    this.tvVentasDetalle = {};
  }

  ngOnInit(): void {
  }

  abrirFlujoPagoGlobal() {
    this.solicitarPagoGlobal.emit();
  }

  obtenerEtiquetaRelacionPagoGlobal(aplicacion: PagoAplicacionLineaDto): string {
    if (!aplicacion?.nIdPagoCliente) {
      return 'Sin pago global';
    }
    return `Pago global #${aplicacion.nIdPagoCliente}`;
  }

  obtenerDescripcionOrigenCanonico(aplicacion: PagoAplicacionLineaDto): string {
    const origen = (aplicacion?.origenRegistro || '').toUpperCase();
    if (origen === 'LEGACY_ABONO') {
      return 'Abono historico vinculado a pago global';
    }
    if (origen.includes('AUTOMATICA')) {
      return 'Asignacion automatica';
    }
    if (origen.includes('MANUAL')) {
      return 'Asignacion manual';
    }
    if (origen === 'PAGO_CLIENTE') {
      return 'Asignacion desde pago global';
    }
    return aplicacion?.origenRegistro || 'Asignacion registrada';
  }
}

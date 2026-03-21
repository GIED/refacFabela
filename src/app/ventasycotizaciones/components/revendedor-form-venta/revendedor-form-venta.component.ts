import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { ProductoService } from '../../../shared/service/producto.service';
import { MessageService } from 'primeng/api';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-revendedor-form-venta',
  templateUrl: './revendedor-form-venta.component.html',
  styleUrls: ['./revendedor-form-venta.component.scss']
})
export class RevendedorFormVentaComponent implements OnInit {

  @Input() listaProductos: TvStockProducto[] = [];
  @Input() saldoGeneralCliente: SaldoGeneralCliente;
  @Input() total: Decimal;
  @Input() nIdCliente: number;
  @Input() ocultarCotizacion: boolean = false;

  @Output() emitirVenta: EventEmitter<DatosVenta> = new EventEmitter<DatosVenta>();
  @Output() soloCotizacion: EventEmitter<any> = new EventEmitter<any>();

  tipoPago: number = 0;
  muestraCredito: boolean = false;
  creditoInsuficiente: boolean = false;
  listaValidada: TvStockProducto[] = [];

  validandoStock: boolean = false;
  stockValidado: boolean = false;
  listaStockStatus: { producto: TvStockProducto; disponible: boolean }[] = [];

  constructor(
    private productoService: ProductoService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.validaCredito();
  }

  /**
   * Evalúa crédito usando el saldo que ya trajo el padre (mismo patrón que form-venta).
   */
  validaCredito() {
    console.log('[revendedor-form-venta] validaCredito → saldoGeneralCliente:', this.saldoGeneralCliente,
                '| total:', this.total?.toString());

    if (!this.saldoGeneralCliente || this.saldoGeneralCliente.nCreditoDisponible == null) {
      this.muestraCredito = false;
      this.creditoInsuficiente = false;
      this.tipoPago = 0;
      return;
    }

    const creditoDisponible = new Decimal(this.saldoGeneralCliente.nCreditoDisponible);
    console.log('[revendedor-form-venta] creditoDisponible:', creditoDisponible.toString(),
                '| total:', this.total?.toString());

    if (creditoDisponible.greaterThan(0) && creditoDisponible.greaterThanOrEqualTo(this.total)) {
      this.muestraCredito = true;
      this.creditoInsuficiente = false;
      this.tipoPago = 1;
    } else {
      this.muestraCredito = false;
      this.creditoInsuficiente = creditoDisponible.greaterThan(0);
      this.tipoPago = 0;
    }
  }

  /**
   * Genera la venta realizando la validación de stock automáticamente.
   * Emite los datos al componente padre si todo está disponible.
   */
  generarVenta() {
    if (this.tipoPago === null || this.tipoPago === undefined) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Seleccione un método de pago', life: 3000 });
      return;
    }

    // Seguridad: aunque la UI lo oculte, bloquear crédito si no está habilitado
    if (this.tipoPago === 1 && !this.muestraCredito) {
      this.messageService.add({ severity: 'error', summary: 'Crédito no disponible', detail: 'El crédito disponible es insuficiente para esta compra. Seleccione pago de Contado.', life: 5000 });
      this.tipoPago = 0;
      return;
    }

    this.listaStockStatus = [];
    this.listaValidada = [];
    this.validandoStock = true;
    this.stockValidado = false;

    let validados = 0;
    let todosDisponibles = true;

    for (const producto of this.listaProductos) {
      this.productoService.obtenerTotalBodegasIdProducto(producto.nIdProducto).subscribe(productoStock => {
        const disponible = productoStock.nCantidadTotal >= producto.nCantidad;
        if (!disponible) {
          todosDisponibles = false;
        }

        this.listaStockStatus.push({ producto, disponible });

        if (disponible) {
          const productoValidado = { ...productoStock };
          productoValidado.nCantidad = producto.nCantidad;
          productoValidado.tcProducto = producto.tcProducto;
          this.listaValidada.push(productoValidado);
        }

        validados++;

        if (validados === this.listaProductos.length) {
          this.validandoStock = false;
          this.stockValidado = true;
          
          if (!todosDisponibles) {
            this.messageService.add({
              severity: 'error',
              summary: 'Stock insuficiente',
              detail: 'Transacción detenida. Algunos de los productos seleccionados ya no están disponibles en la cantidad requerida.',
              life: 5000
            });
            return;
          }

          // Si todo está disponible, emitir la venta
          const datosVenta = new DatosVenta();
          datosVenta.tipoPago = this.tipoPago;
          datosVenta.listaValidada = this.listaValidada;

          this.emitirVenta.emit(datosVenta);
        }
      });
    }
  }

  emiteSoloCotizacion() {
    this.soloCotizacion.emit();
  }
}

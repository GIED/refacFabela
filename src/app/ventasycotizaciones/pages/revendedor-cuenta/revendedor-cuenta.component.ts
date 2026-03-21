import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/service/token.service';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { VentasService } from '../../../shared/service/ventas.service';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { TvVentasDetalle } from '../../../productos/model/TvVentasDetalle';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';
import { TvStockProducto } from '../../../productos/model/TvStockProducto';
import { TwCotizacionProducto } from '../../../productos/model/TwCotizacionProducto';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { locator } from '../../../shared/sesion/locator';
import { HttpClient } from '@angular/common/http';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-revendedor-cuenta',
  templateUrl: './revendedor-cuenta.component.html',
  styleUrls: ['./revendedor-cuenta.component.scss']
})
export class RevendedorCuentaComponent implements OnInit {

  nIdCliente: number;
  nombreCliente: string = '';

  saldoGeneralCliente: SaldoGeneralCliente = new SaldoGeneralCliente();

  // Ventas
  listaVentas: TvVentasDetalle[] = [];
  listaPendientes: TvVentasDetalle[] = [];
  filtroVentas: string = '';
  filtroPendientes: string = '';
  cargandoVentas: boolean = false;

  // Cotizaciones
  listaCotizaciones: TwCotizacion[] = [];
  filtroCotizaciones: string = '';
  cargandoCotizaciones: boolean = false;

  // Estado general
  cargandoSaldo: boolean = false;

  // Detalle abono dialog
  mostrarAbonos: boolean = false;
  abonosVenta: any[] = [];
  ventaSeleccionada: TvVentasDetalle = null;
  cargandoAbonos: boolean = false;

  // Convertir cotización a venta
  mostrarConvertirVenta: boolean = false;
  cotizacionAConvertir: TwCotizacion = null;
  productosConvertir: TvStockProducto[] = [];
  totalConvertir: Decimal = new Decimal(0);
  cargandoConversion: boolean = false;

  // Resultado de operación
  mostrarResultado: boolean = false;
  resultadoIdVenta: number = null;
  resultadoIdCotizacion: number = null;

  // Charts
  chartMensual: any;
  chartTipos: any;
  chartOptions: any;
  chartDonutOptions: any;

  constructor(
    private tokenService: TokenService,
    private clienteService: ClienteService,
    private ventasService: VentasService,
    private ventasCotizacionesService: VentasCotizacionesService,
    private messageService: MessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.nIdCliente = this.tokenService.getIdCliente();
    this.cargarTodo();
  }

  cargarTodo(): void {
    this.cargarSaldo();
    this.cargarVentas();
    this.cargarCotizaciones();
  }

  cargarSaldo(): void {
    this.cargandoSaldo = true;
    this.clienteService.obtenerSaldoGeneralCliente(this.nIdCliente).subscribe({
      next: (data) => {
        this.saldoGeneralCliente = data;
        if (data?.tcCliente?.sRazonSocial) {
          this.nombreCliente = data.tcCliente.sRazonSocial;
        }
        this.cargandoSaldo = false;
      },
      error: () => { this.cargandoSaldo = false; }
    });
  }

  cargarVentas(): void {
    this.cargandoVentas = true;
    this.ventasService.obtenerHistorialVentasCliente(this.nIdCliente).subscribe({
      next: (data) => {
        this.listaVentas = (data || []).map(v => {
          if (v.dFechaVenta) {
            const f = new Date(v.dFechaVenta);
            f.setDate(f.getDate() + 1);
            v.dFechaVenta = f;
          }
          return v;
        });
        this.cargarPendientes();
        this.prepararCharts();
        this.cargandoVentas = false;
      },
      error: () => { this.cargandoVentas = false; }
    });
  }

  cargarPendientes(): void {
    this.ventasService.obtenerVentasPendientesCliente(this.nIdCliente).subscribe({
      next: (data) => {
        this.listaPendientes = (data || []).map(v => {
          if (v.dFechaVenta) {
            const f = new Date(v.dFechaVenta);
            f.setDate(f.getDate() + 1);
            v.dFechaVenta = f;
          }
          if (v.dFechaTerminoCredito) {
            const hoy = new Date();
            const venc = new Date(v.dFechaTerminoCredito);
            v.nVencido = venc < hoy;
          }
          return v;
        });
      },
      error: () => {}
    });
  }

  cargarCotizaciones(): void {
    this.cargandoCotizaciones = true;
    this.ventasCotizacionesService.obtenerHistorialCotizacionesCliente(this.nIdCliente).subscribe({
      next: (data) => {
        this.listaCotizaciones = data || [];
        this.cargandoCotizaciones = false;
      },
      error: () => { this.cargandoCotizaciones = false; }
    });
  }

  // ---- Charts ----
  prepararCharts(): void {
    const MESES = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
    const hoy = new Date();
    // últimos 6 meses
    const labels: string[] = [];
    const mesesSlots: { y: number; m: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      labels.push(MESES[d.getMonth()] + ' ' + d.getFullYear().toString().slice(2));
      mesesSlots.push({ y: d.getFullYear(), m: d.getMonth() });
    }

    const contadoMes = new Array(6).fill(0);
    const creditoPagadoMes = new Array(6).fill(0);
    const creditoPendienteMes = new Array(6).fill(0);

    let totalContado = 0;
    let totalCreditoPagado = 0;
    let totalCreditoPendiente = 0;

    for (const v of this.listaVentas) {
      if (!v.dFechaVenta) continue;
      const fv = new Date(v.dFechaVenta);
      const idx = mesesSlots.findIndex(s => s.y === fv.getFullYear() && s.m === fv.getMonth());
      const monto = v.nTotalVenta ? new Decimal(v.nTotalVenta.toString()).toNumber() : 0;

      if (v.nTipoPago === 1) {
        // Crédito
        const pagado = (v as any).dFechaPagoCredito != null;
        if (pagado) {
          totalCreditoPagado += monto;
          if (idx >= 0) creditoPagadoMes[idx] += monto;
        } else {
          totalCreditoPendiente += monto;
          if (idx >= 0) creditoPendienteMes[idx] += monto;
        }
      } else {
        // Contado
        totalContado += monto;
        if (idx >= 0) contadoMes[idx] += monto;
      }
    }

    this.chartMensual = {
      labels,
      datasets: [
        {
          type: 'bar',
          label: 'Contado',
          backgroundColor: '#2563eb',
          borderRadius: 6,
          data: contadoMes.map(v => +v.toFixed(2))
        },
        {
          type: 'bar',
          label: 'Crédito Pagado',
          backgroundColor: '#16a34a',
          borderRadius: 6,
          data: creditoPagadoMes.map(v => +v.toFixed(2))
        },
        {
          type: 'bar',
          label: 'Crédito Pendiente',
          backgroundColor: '#ea580c',
          borderRadius: 6,
          data: creditoPendienteMes.map(v => +v.toFixed(2))
        }
      ]
    };

    this.chartTipos = {
      labels: ['Contado', 'Crédito Pagado', 'Crédito Pendiente'],
      datasets: [{
        data: [+totalContado.toFixed(2), +totalCreditoPagado.toFixed(2), +totalCreditoPendiente.toFixed(2)],
        backgroundColor: ['#2563eb', '#16a34a', '#ea580c'],
        hoverBackgroundColor: ['#1d4ed8', '#15803d', '#c2410c'],
        borderWidth: 0
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ' $' + ctx.parsed.y.toLocaleString('es-MX', { minimumFractionDigits: 2 })
          }
        }
      },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { font: { size: 11 } } },
        y: {
          stacked: true,
          grid: { color: '#f1f5f9' },
          ticks: {
            font: { size: 11 },
            callback: (v: number) => '$' + (v >= 1000 ? (v/1000).toFixed(0)+'k' : v)
          }
        }
      }
    };

    this.chartDonutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { size: 12 }, padding: 16 } },
        tooltip: {
          callbacks: {
            label: (ctx: any) => ' $' + ctx.parsed.toLocaleString('es-MX', { minimumFractionDigits: 2 })
          }
        }
      }
    };
  }

  // ---- Filtros ----
  get pendientesFiltrados(): TvVentasDetalle[] {
    if (!this.filtroPendientes?.trim()) return this.listaPendientes;
    const q = this.filtroPendientes.toLowerCase();
    return this.listaPendientes.filter(v =>
      v.sFolioVenta?.toLowerCase().includes(q) ||
      v.tcFormapago?.sDescripcion?.toLowerCase().includes(q)
    );
  }

  get ventasVencidas(): TvVentasDetalle[] {
    return this.listaPendientes.filter(v => v.nVencido);
  }

  get montoVencido(): number {
    return this.ventasVencidas.reduce((acc, v) => {
      const monto = v.nSaldoTotal ? new Decimal(v.nSaldoTotal.toString()).toNumber() : 0;
      return acc + monto;
    }, 0);
  }

  get ventasFiltradas(): TvVentasDetalle[] {
    if (!this.filtroVentas?.trim()) return this.listaVentas;
    const q = this.filtroVentas.toLowerCase();
    return this.listaVentas.filter(v =>
      v.sFolioVenta?.toLowerCase().includes(q) ||
      v.tcEstatusVenta?.sDescripcion?.toLowerCase().includes(q) ||
      v.tcFormapago?.sDescripcion?.toLowerCase().includes(q)
    );
  }

  get cotizacionesFiltradas(): TwCotizacion[] {
    if (!this.filtroCotizaciones?.trim()) return this.listaCotizaciones;
    const q = this.filtroCotizaciones.toLowerCase();
    return this.listaCotizaciones.filter(c =>
      c.sFolioCotizacion?.toLowerCase().includes(q) ||
      String(c.nId).includes(q)
    );
  }

  // ---- Descarga de PDFs ----
  descargarVentaPdf(nId: number): void {
    const url = environment.servicios.apiRefacFabela + locator.generarVentaPdf + 'nIdVenta=' + nId;
    this.http.get<any>(url, { responseType: 'arraybuffer' as 'json' }).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.target = '_blank';
        link.click();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el PDF' });
      }
    });
  }

  descargarCotizacionPdf(nId: number): void {
    this.ventasCotizacionesService.generarCotizacionPdf(nId).subscribe({
      next: (data: any) => {
        const blob = new Blob([data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.target = '_blank';
        link.click();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar la cotización' });
      }
    });
  }

  // ---- Abonos dialog ----
  verAbonos(venta: TvVentasDetalle): void {
    this.ventaSeleccionada = venta;
    this.mostrarAbonos = true;
    this.cargandoAbonos = true;
    this.abonosVenta = [];
    this.ventasService.obtenerAbonosVentaId(venta.nId).subscribe({
      next: (data) => { this.abonosVenta = data || []; this.cargandoAbonos = false; },
      error: () => { this.cargandoAbonos = false; }
    });
  }

  // ---- Helpers ----
  get creditoUtilizadoPct(): number {
    if (!this.saldoGeneralCliente?.nSaldoUtilizado) return 0;
    return Math.min(new Decimal(this.saldoGeneralCliente.nSaldoUtilizado.toString()).toNumber(), 100);
  }

  get barColor(): string {
    const pct = this.creditoUtilizadoPct;
    if (pct >= 90) return '#dc2626';
    if (pct >= 70) return '#ea580c';
    return '#16a34a';
  }

  formatCurrency(val: any): string {
    if (val == null) return '$0.00';
    return '$' + new Decimal(val.toString()).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  getEstatusTag(descripcion: string): string {
    if (!descripcion) return 'secondary';
    const e = descripcion.toLowerCase();
    if (e.includes('cancel')) return 'danger';
    if (e.includes('entregad') || e.includes('completad') || e.includes('pagad')) return 'success';
    if (e.includes('pendiente') || e.includes('crédito') || e.includes('credito') || e.includes('cobrar')) return 'warning';
    return 'info';
  }

  getEstatusCotizacion(nEstatus: number): { label: string; severity: string } {
    switch (nEstatus) {
      case 1: return { label: 'Vigente', severity: 'success' };
      case 2: return { label: 'Convertida', severity: 'info' };
      case 3: return { label: 'Vencida', severity: 'warning' };
      default: return { label: 'Desconocido', severity: 'secondary' };
    }
  }

  // ---- Convertir cotización a venta ----

  convertirAVenta(cotizacion: TwCotizacion): void {
    this.cotizacionAConvertir = cotizacion;
    this.cargandoConversion = true;
    this.productosConvertir = [];
    this.totalConvertir = new Decimal(0);

    this.ventasCotizacionesService.obtenerCotizacionProducto(cotizacion.nId).subscribe({
      next: (productos: TwCotizacionProducto[]) => {
        if (!productos || productos.length === 0) {
          this.messageService.add({ severity: 'warn', summary: 'Sin productos', detail: 'La cotización no tiene productos registrados.', life: 3000 });
          this.cargandoConversion = false;
          return;
        }

        // Mapear productos de cotización a TvStockProducto para el componente form-venta
        const mapped: TvStockProducto[] = productos.map(cp => {
          const stock = new TvStockProducto();
          stock.nIdProducto = cp.nIdProducto;
          stock.nCantidad = cp.nCantidad;
          stock.nCantidadTotal = cp.nCantidad; // se validará contra stock real en el form
          stock.tcProducto = cp.tcProducto;

          // Usar precios almacenados en la cotización
          if (cp.nPrecioUnitario != null && cp.nTotalUnitario != null) {
            stock.tcProducto.nPrecioSinIva = cp.nPrecioUnitario;
            stock.tcProducto.nPrecioConIva = cp.nTotalUnitario;
          }

          // Calcular totales de la partida
          const precio = new Decimal(stock.tcProducto.nPrecioSinIva.toString());
          const cant = new Decimal(stock.nCantidad.toString());
          const iva = new Decimal('0.16');
          const subtotal = precio.mul(cant);
          const montoIva = subtotal.mul(iva);
          stock.nTotalUnitario = precio.plus(precio.mul(iva)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
          stock.nTotalPartida = subtotal.plus(montoIva).toDecimalPlaces(2, Decimal.ROUND_DOWN);

          return stock;
        });

        this.productosConvertir = mapped;
        this.totalConvertir = mapped.reduce(
          (acc, p) => acc.plus(new Decimal(p.nTotalPartida.toString())),
          new Decimal(0)
        ).toDecimalPlaces(2, Decimal.ROUND_DOWN);

        this.cargandoConversion = false;
        this.mostrarConvertirVenta = true;
      },
      error: () => {
        this.cargandoConversion = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudieron cargar los productos de la cotización.', life: 3000 });
      }
    });
  }

  generarVentaDesdeCotizacion(datosVenta: DatosVenta): void {
    datosVenta.idCliente = this.nIdCliente;
    datosVenta.idUsuario = this.tokenService.getIdUser();
    datosVenta.sFolioVenta = this.createFolio();
    datosVenta.idTipoVenta = 1;
    datosVenta.twCotizacion = this.cotizacionAConvertir;

    if (datosVenta.tipoPago === 1) {
      datosVenta.fechaIniCredito = new Date();
      const fin = new Date();
      fin.setDate(fin.getDate() + 30);
      datosVenta.fechaFinCredito = fin;
    } else {
      datosVenta.fechaIniCredito = null;
      datosVenta.fechaFinCredito = null;
    }

    this.ventasService.guardaVenta(datosVenta).subscribe({
      next: (venta) => {
        this.mostrarConvertirVenta = false;
        this.resultadoIdVenta = venta.nId;
        this.resultadoIdCotizacion = this.cotizacionAConvertir?.nId;
        this.mostrarResultado = true;
        this.cargarCotizaciones();
        this.cargarVentas();
        this.cargarSaldo();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la venta.', life: 5000 });
      }
    });
  }

  descargarResultadoVenta(): void {
    if (this.resultadoIdVenta) {
      this.ventasService.generarVentaPdf(this.resultadoIdVenta).subscribe(resp => {
        const file = new Blob([resp], { type: 'application/pdf' });
        if (file && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'venta_' + this.resultadoIdVenta + '.pdf';
          anchor.href = fileURL;
          anchor.click();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo descargar el comprobante', life: 3000 });
        }
      });
    }
  }

  cerrarResultadoVenta(): void {
    this.mostrarResultado = false;
    this.resultadoIdVenta = null;
    this.resultadoIdCotizacion = null;
    this.cotizacionAConvertir = null;
    this.productosConvertir = [];
    this.totalConvertir = new Decimal(0);
  }

  private createFolio(): string {
    let folio = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      folio += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return folio;
  }
}

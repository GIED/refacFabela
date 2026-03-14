import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/service/token.service';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { VentasService } from '../../../shared/service/ventas.service';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { TvVentasDetalle } from '../../../productos/model/TvVentasDetalle';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';
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
}

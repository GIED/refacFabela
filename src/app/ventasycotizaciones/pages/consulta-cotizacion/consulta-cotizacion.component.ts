import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/administracion/service/cliente.service';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { forkJoin } from 'rxjs';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { MessageService } from 'primeng/api';
import { TokenService } from '../../../shared/service/token.service';
import { TwVenta } from '../../../productos/model/TwVenta';
import Decimal from 'decimal.js';


@Component({
  selector: 'app-consulta-cotizacion',
  templateUrl: './consulta-cotizacion.component.html',
  styleUrls: ['./consulta-cotizacion.component.scss']
})
export class ConsultaCotizacionComponent implements OnInit {


  //Estas son las variables que se tienen que quedar

  listaCotizaciones: TwCotizacion[];
  listaProductos: TvStockProducto[];
  saldoGeneralCliente: SaldoGeneralCliente;
  mostrarOpcionesVenta: boolean;
  total: Decimal;
  datosRegistraVenta: DatosVenta;
  cotizacionData: TwCotizacion;
  venta: TwVenta
  buscar: string;
  mostrarCotizacionProducto = false;
  nIdCotizacion: number;



  constructor(private clienteService: ClienteService, private ventaService: VentasService, private messageService: MessageService,
    private ventasCotizacionesService: VentasCotizacionesService, private tokenService: TokenService) {
    this.listaCotizaciones = [];
    this.saldoGeneralCliente = new SaldoGeneralCliente();
    this.mostrarOpcionesVenta = false;
    this.total = new Decimal('0');
    this.cotizacionData = new TwCotizacion();

  }

  ngOnInit() {
    this.obtenerCotizaciones();

  }

  obtenerCotizaciones() {
    this.ventasCotizacionesService.obtenerCotizaciones().subscribe(data => {
      this.listaCotizaciones = data;
      //console.log(this.listaCotizaciones);
    });

  }

  consultar() {

    if (this.buscar !== undefined && this.buscar.length >= 1) {
      this.ventasCotizacionesService.obtenerCotizacionesBusqueda(this.buscar).subscribe(data => {
        this.listaCotizaciones = data;
        //console.log(this.listaCotizaciones);
      });

    }
    else {

    }



  }


  detalleCotizacion(twCotizacion: TwCotizacion) {
    this.cotizacionData = twCotizacion;
    let saldo = this.clienteService.obtenerSaldoGeneralCliente(twCotizacion.tcCliente.nId);
    const ensureDec = (v: any) => Decimal.isDecimal(v) ? v as Decimal : new Decimal(v ?? 0);

    let productos = this.ventasCotizacionesService.obtenerCotizacionId(twCotizacion.nId);

    forkJoin([
      saldo, productos
    ]).subscribe(results => {



      if (results[0] != null) {
        this.saldoGeneralCliente = results[0];
      } else {
        this.saldoGeneralCliente.nIdCliente = twCotizacion.tcCliente.nId;
        this.saldoGeneralCliente.nCreditoDisponible = new Decimal('0');
        this.saldoGeneralCliente.nLimiteCredito = twCotizacion.tcCliente.n_limiteCredito;
        this.saldoGeneralCliente.nSaldoTotal = new Decimal('0');
        this.saldoGeneralCliente.tcCliente = twCotizacion.tcCliente;
      }

      this.listaProductos = results[1];


      //console.log('listaProductosCotizados: ',this.listaProductos);

      for (const producto of this.listaProductos) {

        const precio = ensureDec(producto?.tcProducto?.nPrecioConIva);
        const cantidad = ensureDec(producto?.nCantidad);
        this.total = this.total.plus(precio.mul(cantidad));
      }

      this.mostrarOpcionesVenta = true;

    })


  }

  soloCotizacion() {
    this.mostrarOpcionesVenta = false;
    this.total = new Decimal('0');
  }

  generarVenta(datosVenta: DatosVenta) {

    this.datosRegistraVenta = datosVenta;
    this.datosRegistraVenta.idCliente = this.cotizacionData.nIdCliente;
    this.datosRegistraVenta.idUsuario = this.tokenService.getIdUser();
    this.datosRegistraVenta.sFolioVenta = this.createFolio();
    this.datosRegistraVenta.idTipoVenta = 1;
    if (this.datosRegistraVenta.tipoPago === 1) {
      this.datosRegistraVenta.fechaIniCredito = new Date();
      var fin = new Date();
      fin.setDate(fin.getDate() + 30);
      this.datosRegistraVenta.fechaFinCredito = fin;
    } else {
      this.datosRegistraVenta.fechaIniCredito = null;
      this.datosRegistraVenta.fechaFinCredito = null;
    }
    this.datosRegistraVenta.twCotizacion = this.cotizacionData;
    //console.log("Datos para venta en padre");
    //console.log(this.datosRegistraVenta);
    //console.log(this.cotizacionData);

    this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(resp => {
      //console.log(resp);
      this.generarVentaPdf(resp.nId);
      this.mostrarOpcionesVenta = false;
      this.obtenerCotizaciones();
    });
  }


  obtenerVenta(nId: number) {


    this.ventasCotizacionesService.obtenerVentaIdCotizacion(nId).subscribe(resp => {
      this.venta = resp;
      this.generarVentaPdf(this.venta.nId);

    })



  }
  cotizacionProducto(nIdCotizacion: number) {


    this.nIdCotizacion = nIdCotizacion;
    this.mostrarCotizacionProducto = true;

  }

  generarVentaPdf(nId: number) {

    this.ventaService.generarVentaPdf(nId).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Comprobante de venta generado', life: 3000 });
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000 });
      }

    });

  }





  createFolio(): string {
    let folio = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      folio += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return folio;
  }

  generarCotizacionPdf(twCotizacion: TwCotizacion) {

    this.ventasCotizacionesService.generarCotizacionPdf(twCotizacion.nId).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'cotizacion_' + twCotizacion.nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cotizacion Generada', life: 3000 });

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la Cotizacion', life: 3000 });
      }

    });

  }

}



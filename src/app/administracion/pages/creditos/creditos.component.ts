import {Component, OnInit} from '@angular/core';
import { Product } from '../../../shared/model/product';
import { ProductService } from '../../../shared/service/productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api';
import { SaldoGeneralCliente } from '../../../ventasycotizaciones/model/TvSaldoGeneralCliente';
import { ClienteService } from '../../service/cliente.service';
import { totalesGeneralesCreditos } from '../../interfaces/totalesGeneralesCredito';
import { VentasService } from '../../../shared/service/ventas.service';
import { TvVentasDetalle } from '../../../productos/model/TvVentasDetalle';
import { TwAbono } from '../../../productos/model/TwAbono';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import { FacturaService } from 'src/app/shared/service/factura.service';
import { PagoClienteService } from 'src/app/shared/service/pago-cliente.service';
import { PagoClienteDetalleDto } from '../../model/PagoClienteDetalleDto';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TcFormaPago } from 'src/app/productos/model/TcFormaPago';
import { TwCaja } from 'src/app/productos/model/TwCaja';
import { TcCuentaBancaria } from 'src/app/productos/model/TcCuentaBancaria';
import { DatosFacturaDto } from 'src/app/productos/model/DatosFacturaDto';
import { forkJoin } from 'rxjs';
import { PagoClienteRegistroDto } from '../../model/PagoClienteRegistroDto';
import { FacturaCreditoPendienteDto } from '../../model/FacturaCreditoPendienteDto';
import { PagoAplicacionManualRequestDto } from '../../model/PagoAplicacionManualRequestDto';
import { PagoAplicacionManualLineaDto } from '../../model/PagoAplicacionManualLineaDto';
import { PagoAplicacionAutomaticaRequestDto } from '../../model/PagoAplicacionAutomaticaRequestDto';
import { PagoAplicacionLineaDto } from '../../model/PagoAplicacionLineaDto';
import { NgxSpinnerService } from 'ngx-spinner';
import { TipoDoc } from 'src/app/shared/utils/TipoDoc.enum';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }

  @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
          text-align: center;
      }

      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
      }
  }
 

`],
})
export class CreditosComponent implements OnInit {

  
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  submitted: boolean; 
  formulario:FormGroup;
  formularioPagoCanonico: FormGroup;
 

  /*listas y variables actuales*/

  listaClientesCredito: SaldoGeneralCliente;
  listaAbonosVenta:TwAbono[];
  listaVentasDetalleCliente: TvVentasDetalle[];
  listaPagosCanonicosCliente: PagoClienteDetalleDto[];
  listaAplicacionesCanonicasVenta: PagoAplicacionLineaDto[];
  listaFacturasPendientesPagoCanonico: FacturaCreditoPendienteDto[];
  listaFormaPagoCanonico: TcFormaPago[];
  listaCuentasDestinoCanonico: TcCuentaBancaria[];
  totalesCreditos: totalesGeneralesCreditos ;
  pieData: any;
  pieOptions: any;
  car:any
  displayUnifiedPaymentDialog: boolean = false;
  displayConsultaPagosSatDialog: boolean = false;
  selectedFacturas: FacturaCreditoPendienteDto[] = [];
  usandoPagoGlobalExistente: boolean = false;
  cargandoConsultaPagosSat: boolean = false;
  filtroFacturasPagoCanonico: 'relacionables' | 'facturadas' | 'sin-factura' = 'relacionables';
  filtroBusquedaFacturasPagoCanonico: string = '';
  filtroEstadoFacturasPagoCanonico: 'todos' | 'relacionable' | 'facturada_no_ppd' | 'no_facturada' | 'cancelada' = 'todos';
  opcionesFiltroEstadoFacturasPagoCanonico = [
    { label: 'Todos los estados', value: 'todos' },
    { label: 'Relacionables', value: 'relacionable' },
    { label: 'Facturadas sin PPD/99', value: 'facturada_no_ppd' },
    { label: 'No facturadas', value: 'no_facturada' },
    { label: 'Canceladas', value: 'cancelada' }
  ];
  productDialogPagosCanonicos: boolean;
  productDialogRegistroPagoCanonico: boolean;
  productDialogAplicacionPagoCanonico: boolean;
  productDialog: boolean;
  productDialog2: boolean;
  mostrarSoloRepPendienteCanonico: boolean;
  mostrarSoloRepPendientePagoCanonico: boolean;
  procesandoPagoCanonico: boolean;
  cols:any;
  tvVentasDetalle:TvVentasDetalle;
  auxSaldoGeneralCliente: SaldoGeneralCliente;
  cajaActivaCanonico: TwCaja;
  pagoCanonicoSeleccionado: PagoClienteDetalleDto;
  pagoConsultaSatSeleccionado: PagoClienteDetalleDto;
  notaConsolidacionPendiente: string;
  nIdVentaObjetivoPagoCanonico?: number;
  clienteConsultaPagosSatSeleccionado: SaldoGeneralCliente;
  listaPagosConsultaSatCliente: PagoClienteDetalleDto[];

  constructor(private productService: ProductService, private messageService: MessageService,
              private confirmationService: ConfirmationService, private clienteService:ClienteService, private ventasService: VentasService, private fb: FormBuilder, private router: Router, private facturaService: FacturaService,
              private pagoClienteService: PagoClienteService, private catalogoService: CatalogoService,
              private tokenService: TokenService, private spinner: NgxSpinnerService) {
                  this.totalesCreditos={};

                  this.cols = [
                    { field: 'tcCliente.sRfc', header: 'RFC' },
                    { field: 'tcCliente.sRazonSocial', header: 'RazÃ³n Social' },
                    { field: 'nLimiteCredito', header: 'Limite CrÃ©dito' },
                    { field: 'nCreditoDisponible', header: 'CrÃ©dito Disponible' },
                    { field: 'nSaldoTotal', header: 'Saldo' },
                    { field: 'nTotalVenta', header: 'Total Venta' },
                    { field: 'nAbonos', header: 'Abonos' },   
                    { field: 'nAvanceCredito', header: 'Avance CrÃ©dito' },
                    { field: 'sEstatus', header: 'Estatus' }
        
                ]
                this.tvVentasDetalle={};
                this.listaAplicacionesCanonicasVenta = [];
                this.listaPagosCanonicosCliente = [];
                this.listaFacturasPendientesPagoCanonico = [];
                this.listaFormaPagoCanonico = [];
                this.listaCuentasDestinoCanonico = [];
                this.displayUnifiedPaymentDialog = false;
                this.displayConsultaPagosSatDialog = false;
                this.selectedFacturas = [];
                this.usandoPagoGlobalExistente = false;
                this.cargandoConsultaPagosSat = false;
                this.filtroFacturasPagoCanonico = 'relacionables';
                this.filtroBusquedaFacturasPagoCanonico = '';
                this.filtroEstadoFacturasPagoCanonico = 'todos';
                this.productDialog = false;
                this.productDialog2 = false;
                this.productDialogPagosCanonicos = false;
                this.productDialogRegistroPagoCanonico = false;
                this.productDialogAplicacionPagoCanonico = false;
                this.mostrarSoloRepPendienteCanonico = false;
                this.mostrarSoloRepPendientePagoCanonico = false;
                this.procesandoPagoCanonico = false;
                this.cajaActivaCanonico = {};
                this.pagoCanonicoSeleccionado = {};
                this.pagoConsultaSatSeleccionado = {};
                this.notaConsolidacionPendiente = 'Los pagos canÃ³nicos sÃ­ pueden aplicarse a varias ventas y la factura consolidada ya estÃ¡ disponible en Caja > FacturaciÃ³n. Selecciona ventas del mismo cliente y misma razÃ³n social y usa Facturar seleccionadas.';
                this.nIdVentaObjetivoPagoCanonico = null;
                this.clienteConsultaPagosSatSeleccionado = null;
                this.listaPagosConsultaSatCliente = [];

                this.crearFormulario();
                this.crearFormularioPagoCanonico();
     
  }

  ngOnInit() {

   this.consultaSaldosCliente();
   
    this.car = [
        { total: '',abono: '',  saldo: '',  nabono: '',  ntotal: ''}
       
    ];

   
  }

  consultaSaldosCliente(){
    this.clienteService.obtenerSaldosClientes().subscribe(data=>{
      this.listaClientesCredito=data;       
     this.totalesCreditos= this.obtenerTotalesCreditos(this.listaClientesCredito);       
    //console.log(this.totalesCreditos);
    this.generarGrafica(this.totalesCreditos);
    //console.log( this.listaClientesCredito);
  });      

  }

  genenerAbonoVentaPDF(tvVentasDetalle:TvVentasDetalle){
 
    this.ventasService.generarAbonoVentaPdf(tvVentasDetalle.nId).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'abono_'+tvVentasDetalle.nId+'_'+tvVentasDetalle.nIdCliente+'.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizÃ³ con Ã©xito', detail: 'comprobante de abono Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotizaciÃ³n 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Se realizÃ³ con Ã©xito', detail: 'Error al generar el comprobante de abono', life: 3000});
      }

  });

  }

  genenerHistorialAbonoVentaPDF(saldoGeneralCliente: SaldoGeneralCliente){

    //console.log("este es el el id del cliente"+saldoGeneralCliente.nIdCliente);
 
    this.ventasService.generarHistorialAbonoVentaPdf(saldoGeneralCliente.nIdCliente).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'historial_abono_'+saldoGeneralCliente.nIdCliente+'.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizÃ³ con Ã©xito', detail: 'historial de crÃ©ditos del cliente generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotizaciÃ³n 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el historial de crÃ©ditos del cliente generado', life: 3000});
      }

  });

  }


  crearFormulario() {
  
    this.formulario = this.fb.group({
        
        abono: ['',[Validators.required]],
        idFormaPago: ['',[Validators.required]],
        
        
    })
    
  }

  crearFormularioPagoCanonico() {
    this.formularioPagoCanonico = this.fb.group({
      fechaPago: [new Date(), [Validators.required]],
      importeTotal: [null, [Validators.required]],
      idFormaPago: [null, [Validators.required]],
      idCuentaDestino: [null, [Validators.required]],
      referencia: [''],
      observaciones: ['']
    });

    this.formularioPagoCanonico.get('importeTotal').valueChanges.subscribe(() => {
      if (this.displayUnifiedPaymentDialog) {
        this.redistribuirMontosSeleccionados();
      }
    });
  }

  generarGrafica(totalesCreditos: totalesGeneralesCreditos){

    this.pieData = {
        labels: ['Saldo General', 'Abono General'],
        datasets: [
            {
                data: [this.totalesCreditos.nSaldoTotalGeneral, this.totalesCreditos.nAbonos],
                backgroundColor: [
                    '#70B5C8',
                    '#96B97A',
                   
                ]
            }]
    };
    this.pieOptions = {
        plugins: {
            legend: {
                labels: {
                    fontColor: '#A0A7B5'
                },
                
            }
        },
      
    };

  }


  obtenerTotalesCreditos(listaClientesCredito:SaldoGeneralCliente){
      this.totalesCreditos.nSaldoTotalGeneral=0;
      this.totalesCreditos.nTotalRegular=0;
      this.totalesCreditos.nTotalVencidos=0;
      this.totalesCreditos.nAbonos=0;
      this.totalesCreditos.nTotalVenta=0;

    for(let i in listaClientesCredito){
        if(listaClientesCredito[i].sEstatus==="REGULAR"){
            this.totalesCreditos.nTotalRegular+=1;        

        }
        if(listaClientesCredito[i].sEstatus==="VENCIDO"){
            this.totalesCreditos.nTotalVencidos+=1;    

        }
        this.totalesCreditos.nSaldoTotalGeneral+=listaClientesCredito[i].nSaldoTotal;   
        this.totalesCreditos.nAbonos+=listaClientesCredito[i].nAbonos;   
        this.totalesCreditos.nTotalVenta+=listaClientesCredito[i].nTotalVenta;    

    }
  return this.totalesCreditos

  }

  refrescar(bandera: boolean){

    if(bandera){
      this.consultaSaldosCliente();
      this.consultaVentaDetalleId(this.auxSaldoGeneralCliente);

    }

  }

  obtenerAbonosVentaId(tvVentasDetalle:TvVentasDetalle) {
     //console.log(tvVentasDetalle);
      this.productDialog2 = true;
      this.tvVentasDetalle=tvVentasDetalle;

      forkJoin([
        this.ventasService.obtenerAbonosVentaId(this.tvVentasDetalle.nId),
        this.pagoClienteService.consultarAplicacionesVenta(this.tvVentasDetalle.nId)
      ]).subscribe(([abonos, aplicaciones]) => {
        this.listaAbonosVenta = abonos || [];
        this.listaAplicacionesCanonicasVenta = aplicaciones || [];
      }, () => {
        this.listaAbonosVenta = [];
        this.listaAplicacionesCanonicasVenta = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar la relaciÃ³n entre abonos y pagos globales de la venta.', life: 4500 });
      });      

  }

  abrirPagosGlobalesDesdeDetalle() {
    this.productDialog2 = false;

    const contexto = this.auxSaldoGeneralCliente
      ? this.auxSaldoGeneralCliente
      : ({
          nIdCliente: this.tvVentasDetalle?.nIdCliente,
          tcCliente: this.tvVentasDetalle?.tcCliente
        } as SaldoGeneralCliente);

    if (!contexto?.tcCliente?.nId && !contexto?.nIdCliente) {
      this.messageService.add({ severity: 'warn', summary: 'Cliente no disponible', detail: 'No fue posible resolver el cliente para abrir sus pagos globales.', life: 4500 });
      return;
    }

    this.messageService.add({ severity: 'info', summary: 'AsignaciÃ³n desde Pago Global', detail: 'Selecciona o registra un Pago Global y usa Aplicar pago para relacionarlo con esta nota.', life: 5000 });
    this.consultarPagosCanonicosCliente(contexto);
  }

  abrirPagosGlobalesParaVenta(venta: TvVentasDetalle) {
    if (!venta) {
      return;
    }
    this.nIdVentaObjetivoPagoCanonico = venta.nId;
    this.abrirPagosGlobalesDesdeDetalle();
  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Deseas borrar los clientes seleccionandos?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => !this.selectedProducts.includes(val));
              this.selectedProducts = null;
              this.messageService.add({severity: 'success', summary: 'Se realizÃ³ con Ã©xito', detail: 'Clientes borrados', life: 3000});
          }
      });
  }

  consultaVentaDetalleId(saldoGeneralCliente: SaldoGeneralCliente) {
     //console.log(saldoGeneralCliente);
      this.productDialog = true;
      this.mostrarSoloRepPendienteCanonico = false;
     this.auxSaldoGeneralCliente=saldoGeneralCliente;
    this.ventasService.obtenerVentaDetalleTipoPago(saldoGeneralCliente.tcCliente.nId, 1).subscribe(data=>{
        this.listaVentasDetalleCliente=data;  
             
      //console.log(this.listaVentasDetalleCliente);
    });      



  }

  consultarPagosCanonicosCliente(saldoGeneralCliente: SaldoGeneralCliente) {
    this.productDialogPagosCanonicos = true;
    this.mostrarSoloRepPendientePagoCanonico = false;
    this.auxSaldoGeneralCliente = saldoGeneralCliente;
    const nIdCliente = saldoGeneralCliente?.tcCliente?.nId || saldoGeneralCliente?.nIdCliente;
    this.cargarPagosGlobalesCliente(nIdCliente, false);
  }

  abrirDialogoUnificado(cliente: any) {
    this.displayUnifiedPaymentDialog = true;
    this.auxSaldoGeneralCliente = cliente as SaldoGeneralCliente;
    this.activarRegistroNuevoPago();
    this.formularioPagoCanonico.reset({
      fechaPago: new Date(),
      importeTotal: null,
      idFormaPago: null,
      idCuentaDestino: null,
      referencia: '',
      observaciones: ''
    });
    this.selectedFacturas = [];
    if (cliente && cliente.tcCliente && cliente.tcCliente.nId && cliente.tcCliente.nIdDatoFactura) {
      this.cargarFacturasPendientesCliente(cliente.tcCliente.nId, cliente.tcCliente.nIdDatoFactura);
      this.cargarPagosGlobalesCliente(cliente.tcCliente.nId);

      forkJoin([
        this.catalogoService.obtenerFormaPago(),
        this.catalogoService.obtenerCajaActiva(),
        this.catalogoService.getCuentasBanciariasRazon(cliente.tcCliente.nIdDatoFactura)
      ]).subscribe(([formasPago, cajaActiva, cuentasDestino]) => {
        this.listaFormaPagoCanonico = formasPago || [];
        this.cajaActivaCanonico = cajaActiva || {};
        this.listaCuentasDestinoCanonico = cuentasDestino || [];
        if (this.listaCuentasDestinoCanonico.length) {
          this.seleccionarCuentaDestinoPorDefecto();
          return;
        }

        this.catalogoService.obtenerCatalogoRazonSocial().subscribe((razones: DatosFacturaDto[]) => {
          const idsRazon = (razones || []).map(item => item?.nId).filter(item => !!item);
          if (!idsRazon.length) {
            this.listaCuentasDestinoCanonico = [];
            this.messageService.add({ severity: 'warn', summary: 'Sin cuentas destino', detail: 'No hay cuentas bancarias registradas.', life: 5000 });
            return;
          }

          forkJoin(idsRazon.map(id => this.catalogoService.getCuentasBanciariasRazon(id))).subscribe(listasCuentas => {
            const cuentasMap = new Map<number, TcCuentaBancaria>();
            (listasCuentas || []).forEach(lista => {
              (lista || []).forEach(cuenta => {
                if (cuenta?.nId != null && !cuentasMap.has(cuenta.nId)) {
                  cuentasMap.set(cuenta.nId, cuenta);
                }
              });
            });

            this.listaCuentasDestinoCanonico = Array.from(cuentasMap.values());
            this.seleccionarCuentaDestinoPorDefecto();
          });
        });
      });
    } else {
      this.listaFacturasPendientesPagoCanonico = [];
      this.listaFormaPagoCanonico = [];
      this.listaCuentasDestinoCanonico = [];
      this.ajustarValidacionCuentaDestino();
    }
  }

  private cargarFacturasPendientesCliente(nIdCliente: number, nIdDatoFactura: number) {
    this.pagoClienteService.consultarFacturasPendientes(nIdCliente, nIdDatoFactura).subscribe(data => {
      this.listaFacturasPendientesPagoCanonico = this.ordenarFacturasPendientesPagoCanonico((data || []).map((item: any) => ({
        ...item,
        montoAplicarSeleccionado: 0
      })));
      this.filtroFacturasPagoCanonico = this.obtenerFiltroInicialFacturasPagoCanonico();
      this.filtroBusquedaFacturasPagoCanonico = '';
      this.filtroEstadoFacturasPagoCanonico = 'todos';
      this.selectedFacturas = [];
    }, () => {
      this.listaFacturasPendientesPagoCanonico = [];
      this.filtroFacturasPagoCanonico = 'relacionables';
      this.filtroBusquedaFacturasPagoCanonico = '';
      this.filtroEstadoFacturasPagoCanonico = 'todos';
      this.selectedFacturas = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar las notas pendientes.', life: 4000 });
    });
  }

  private cargarPagosGlobalesCliente(nIdCliente: number, silencioso: boolean = true) {
    if (!nIdCliente) {
      this.listaPagosCanonicosCliente = [];
      return;
    }

    this.pagoClienteService.consultarPagosCliente(nIdCliente).subscribe(data => {
      this.listaPagosCanonicosCliente = data || [];

      if (this.usandoPagoGlobalExistente && this.pagoCanonicoSeleccionado?.nId) {
        const pagoActualizado = (this.listaPagosCanonicosCliente || []).find(item => item?.nId === this.pagoCanonicoSeleccionado?.nId);
        if (pagoActualizado) {
          this.pagoCanonicoSeleccionado = pagoActualizado;
        } else {
          this.activarRegistroNuevoPago();
        }
      }
    }, () => {
      this.listaPagosCanonicosCliente = [];
      if (!silencioso) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar los pagos globales del cliente.', life: 4000 });
      }
    });
  }

  abrirDialogoConsultaPagosSat(cliente?: SaldoGeneralCliente) {
    this.displayConsultaPagosSatDialog = true;
    this.listaPagosConsultaSatCliente = [];
    this.pagoConsultaSatSeleccionado = {};

    if (cliente) {
      this.seleccionarClienteConsultaPagosSat(cliente);
      return;
    }

    this.clienteConsultaPagosSatSeleccionado = null;
  }

  seleccionarClienteConsultaPagosSat(cliente: SaldoGeneralCliente) {
    this.clienteConsultaPagosSatSeleccionado = cliente;
    const nIdCliente = this.resolverIdClienteCredito(cliente);

    if (!nIdCliente) {
      this.listaPagosConsultaSatCliente = [];
      this.pagoConsultaSatSeleccionado = {};
      return;
    }

    this.cargarPagosConsultaSatCliente(nIdCliente);
  }

  private cargarPagosConsultaSatCliente(nIdCliente: number) {
    this.cargandoConsultaPagosSat = true;
    this.listaPagosConsultaSatCliente = [];
    this.pagoConsultaSatSeleccionado = {};

    this.pagoClienteService.consultarPagosCliente(nIdCliente).subscribe(data => {
      this.cargandoConsultaPagosSat = false;
      this.listaPagosConsultaSatCliente = this.ordenarPagosConsultaSat(data || []);
      this.pagoConsultaSatSeleccionado = this.listaPagosConsultaSatCliente.length ? this.listaPagosConsultaSatCliente[0] : {};
    }, () => {
      this.cargandoConsultaPagosSat = false;
      this.listaPagosConsultaSatCliente = [];
      this.pagoConsultaSatSeleccionado = {};
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar los pagos SAT del cliente.', life: 4000 });
    });
  }

  private ordenarPagosConsultaSat(pagos: PagoClienteDetalleDto[]): PagoClienteDetalleDto[] {
    return [...(pagos || [])].sort((left, right) => {
      const fechaLeft = left?.fechaPago ? new Date(left.fechaPago).getTime() : 0;
      const fechaRight = right?.fechaPago ? new Date(right.fechaPago).getTime() : 0;
      if (fechaLeft !== fechaRight) {
        return fechaRight - fechaLeft;
      }
      return Number(right?.nId || 0) - Number(left?.nId || 0);
    });
  }

  private resolverIdClienteCredito(cliente: SaldoGeneralCliente): number {
    return Number(cliente?.tcCliente?.nId || cliente?.nIdCliente || 0);
  }

  obtenerEtiquetaClienteCredito(cliente: SaldoGeneralCliente): string {
    if (!cliente) {
      return 'Selecciona un cliente';
    }

    const rfc = cliente?.tcCliente?.sRfc || 'RFC';
    const razon = cliente?.tcCliente?.sRazonSocial || 'Sin razon social';
    return `${rfc} - ${razon}`;
  }

  seleccionarPagoConsultaSat(pago: PagoClienteDetalleDto) {
    this.pagoConsultaSatSeleccionado = pago || {};
  }

  get aplicacionesPagoSatSeleccionado(): PagoAplicacionLineaDto[] {
    const aplicaciones = this.pagoConsultaSatSeleccionado?.aplicaciones || [];
    return [...aplicaciones].sort((left, right) => {
      const ordenLeft = Number(left?.ordenAplicacion || 0);
      const ordenRight = Number(right?.ordenAplicacion || 0);
      if (ordenLeft !== ordenRight) {
        return ordenLeft - ordenRight;
      }
      return Number(left?.nIdVenta || 0) - Number(right?.nIdVenta || 0);
    });
  }

  get totalPagosConsultaSatTimbrados(): number {
    return (this.listaPagosConsultaSatCliente || []).filter(item => this.puedeDescargarComprobantePagoSat(item)).length;
  }

  get totalFacturasPagoSatSeleccionado(): number {
    return (this.aplicacionesPagoSatSeleccionado || []).length;
  }

  get totalMontoFacturasPagoSatSeleccionado(): number {
    return (this.aplicacionesPagoSatSeleccionado || []).reduce((total, item) => total + Number(item?.montoAplicado || 0), 0);
  }

  puedeDescargarComprobantePagoSat(pago: PagoClienteDetalleDto): boolean {
    const estado = (pago?.estadoRepCanonico || '').toUpperCase();
    return !!pago?.nIdComplementoRepCanonico && estado === 'TIMBRADO';
  }

  descargarComprobantePagoSatPdf(pago: PagoClienteDetalleDto) {
    this.descargarComprobantePagoSat(pago, TipoDoc.PDF_COMPLEMENTO_PAGO, 'pdf', 'application/pdf');
  }

  descargarComprobantePagoSatXml(pago: PagoClienteDetalleDto) {
    this.descargarComprobantePagoSat(pago, TipoDoc.XML_COMPLEMENTO_PAGO, 'xml', 'application/xml');
  }

  private descargarComprobantePagoSat(pago: PagoClienteDetalleDto, tipoDoc: TipoDoc, extension: string, mimeType: string) {
    if (!this.puedeDescargarComprobantePagoSat(pago)) {
      this.messageService.add({ severity: 'warn', summary: 'Sin comprobante', detail: 'El pago seleccionado todavia no tiene complemento SAT timbrado.', life: 4000 });
      return;
    }

    this.facturaService.descargarDocumentoComplemento(pago.nIdComplementoRepCanonico, tipoDoc).subscribe(resp => {
      this.descargarArchivoBuffer(resp, mimeType, `comprobante_pago_${pago?.nId || 'sat'}.${extension}`,
        `Se descargo el ${extension.toUpperCase()} del comprobante de pago.`,
        `No se encontro el ${extension.toUpperCase()} del comprobante de pago.`);
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `No fue posible descargar el ${extension.toUpperCase()} del comprobante de pago.`, life: 4000 });
    });
  }

  puedeDescargarFacturaSat(aplicacion: PagoAplicacionLineaDto): boolean {
    const estadoFactura = (aplicacion?.estadoFactura || '').toUpperCase();
    return !!aplicacion?.nIdVenta && !!aplicacion?.uuidFactura && !estadoFactura.includes('CANCEL');
  }

  descargarFacturaSatPdf(aplicacion: PagoAplicacionLineaDto) {
    this.descargarFacturaSat(aplicacion, TipoDoc.PDF_FACTURA, 'pdf', 'application/pdf');
  }

  descargarFacturaSatXml(aplicacion: PagoAplicacionLineaDto) {
    this.descargarFacturaSat(aplicacion, TipoDoc.XML_FACTURA, 'xml', 'application/xml');
  }

  private descargarFacturaSat(aplicacion: PagoAplicacionLineaDto, tipoDoc: TipoDoc, extension: string, mimeType: string) {
    if (!this.puedeDescargarFacturaSat(aplicacion)) {
      return;
    }

    this.facturaService.descargarDocumento(aplicacion.nIdVenta, tipoDoc).subscribe(resp => {
      this.descargarArchivoBuffer(resp, mimeType, `factura_vinculada_${aplicacion?.nIdVenta || 'sat'}.${extension}`,
        `Se descargo el ${extension.toUpperCase()} de la factura vinculada.`,
        `No se encontro el ${extension.toUpperCase()} de la factura vinculada.`);
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: `No fue posible descargar el ${extension.toUpperCase()} de la factura vinculada.`, life: 4000 });
    });
  }

  obtenerEtiquetaFacturaSat(aplicacion: PagoAplicacionLineaDto): string {
    if (!aplicacion?.uuidFactura) {
      return 'Sin factura SAT';
    }

    const estadoFactura = (aplicacion?.estadoFactura || '').toUpperCase();
    if (estadoFactura.includes('CANCEL')) {
      return 'Factura cancelada';
    }

    const metodo = aplicacion?.metodoPagoFiscal || 'N/D';
    const forma = aplicacion?.formaPagoFiscal || 'N/D';
    return `${metodo}/${forma}`;
  }

  obtenerSeverityFacturaSat(aplicacion: PagoAplicacionLineaDto): string {
    if (!aplicacion?.uuidFactura) {
      return 'warning';
    }

    const estadoFactura = (aplicacion?.estadoFactura || '').toUpperCase();
    if (estadoFactura.includes('CANCEL')) {
      return 'danger';
    }

    const metodo = (aplicacion?.metodoPagoFiscal || '').toUpperCase();
    const forma = (aplicacion?.formaPagoFiscal || '').toUpperCase();
    if (metodo === 'PPD' && forma === '99') {
      return 'success';
    }

    return 'info';
  }

  private descargarArchivoBuffer(resp: any, mimeType: string, fileName: string, successDetail: string, emptyDetail: string) {
    const file = new Blob([resp], { type: mimeType });
    if (file != null && file.size > 0) {
      const fileURL = window.URL.createObjectURL(file);
      const anchor = document.createElement('a');
      anchor.download = fileName;
      anchor.href = fileURL;
      anchor.click();
      this.messageService.add({ severity: 'success', summary: 'Correcto', detail: successDetail, life: 3000 });
      return;
    }

    this.messageService.add({ severity: 'warn', summary: 'Sin archivo', detail: emptyDetail, life: 3500 });
  }

  activarRegistroNuevoPago() {
    this.usandoPagoGlobalExistente = false;
    this.pagoCanonicoSeleccionado = {};
    this.selectedFacturas = [];
    (this.listaFacturasPendientesPagoCanonico || []).forEach(factura => {
      factura.montoAplicarSeleccionado = 0;
    });
  }

  seleccionarPagoGlobalExistente(pago: PagoClienteDetalleDto) {
    if (!this.tieneSaldoDisponiblePago(pago)) {
      return;
    }

    this.usandoPagoGlobalExistente = true;
    this.pagoCanonicoSeleccionado = pago;
    this.selectedFacturas = [];
    (this.listaFacturasPendientesPagoCanonico || []).forEach(factura => {
      factura.montoAplicarSeleccionado = 0;
    });
  }

  esPagoGlobalSeleccionado(pago: PagoClienteDetalleDto): boolean {
    return !!pago?.nId && !!this.pagoCanonicoSeleccionado?.nId && pago.nId === this.pagoCanonicoSeleccionado.nId;
  }

  tieneSaldoDisponiblePago(pago: PagoClienteDetalleDto): boolean {
    return Number(pago?.importeDisponible || 0) > 0;
  }

  abrirDialogoRegistroPagoCanonico() {
    const nIdDatoFactura = this.auxSaldoGeneralCliente?.tcCliente?.nIdDatoFactura;
    if (!nIdDatoFactura) {
      this.messageService.add({ severity: 'warn', summary: 'RazÃ³n social faltante', detail: 'El cliente no tiene razÃ³n social fiscal asignada para registrar un pago global.', life: 5000 });
      return;
    }

    this.productDialogRegistroPagoCanonico = true;
    this.formularioPagoCanonico.reset({
      fechaPago: new Date(),
      importeTotal: null,
      idFormaPago: null,
      idCuentaDestino: null,
      referencia: '',
      observaciones: ''
    });
    this.ajustarValidacionCuentaDestino();

    forkJoin([
      this.catalogoService.obtenerFormaPago(),
      this.catalogoService.obtenerCajaActiva(),
      this.catalogoService.getCuentasBanciariasRazon(nIdDatoFactura)
    ]).subscribe(([formasPago, cajaActiva, cuentasDestino]) => {
      this.listaFormaPagoCanonico = formasPago || [];
      this.cajaActivaCanonico = cajaActiva || {};
      this.listaCuentasDestinoCanonico = cuentasDestino || [];
      if (this.listaCuentasDestinoCanonico.length) {
        this.seleccionarCuentaDestinoPorDefecto();
        return;
      }

      this.catalogoService.obtenerCatalogoRazonSocial().subscribe((razones: DatosFacturaDto[]) => {
        const idsRazon = (razones || []).map(item => item?.nId).filter(item => !!item);
        if (!idsRazon.length) {
          this.listaCuentasDestinoCanonico = [];
          this.messageService.add({ severity: 'warn', summary: 'Sin cuentas destino', detail: 'No hay cuentas bancarias registradas para seleccionar como destino del pago.', life: 5000 });
          return;
        }

        forkJoin(idsRazon.map(id => this.catalogoService.getCuentasBanciariasRazon(id))).subscribe(listasCuentas => {
          const cuentasMap = new Map<number, TcCuentaBancaria>();
          (listasCuentas || []).forEach(lista => {
            (lista || []).forEach(cuenta => {
              if (cuenta?.nId != null && !cuentasMap.has(cuenta.nId)) {
                cuentasMap.set(cuenta.nId, cuenta);
              }
            });
          });

          this.listaCuentasDestinoCanonico = Array.from(cuentasMap.values());
          this.seleccionarCuentaDestinoPorDefecto();

          if (this.listaCuentasDestinoCanonico.length) {
            this.messageService.add({ severity: 'info', summary: 'Cuentas disponibles', detail: 'Se muestran las cuentas bancarias registradas para identificar en cuÃ¡l ingresÃ³ el pago.', life: 5000 });
            return;
          }

          this.messageService.add({ severity: 'warn', summary: 'Sin cuentas destino', detail: 'No hay cuentas bancarias registradas para seleccionar como destino del pago.', life: 5000 });
        }, () => {
          this.listaCuentasDestinoCanonico = [];
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible cargar las cuentas bancarias registradas.', life: 4000 });
        });
      }, () => {
        this.listaCuentasDestinoCanonico = [];
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar las razones sociales para obtener las cuentas bancarias registradas.', life: 4000 });
      });
    }, () => {
      this.listaFormaPagoCanonico = [];
      this.cajaActivaCanonico = {};
      this.listaCuentasDestinoCanonico = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible cargar catÃ¡logo de formas de pago, caja activa o cuentas destino.', life: 4000 });
    });
  }

  private seleccionarCuentaDestinoPorDefecto() {
    if (this.listaCuentasDestinoCanonico.length === 1) {
      this.formularioPagoCanonico.patchValue({
        idCuentaDestino: this.listaCuentasDestinoCanonico[0].nId
      });
    }

    this.ajustarValidacionCuentaDestino();
  }

  private ajustarValidacionCuentaDestino() {
    const controlCuenta = this.formularioPagoCanonico?.get('idCuentaDestino');
    if (!controlCuenta) {
      return;
    }

    if ((this.listaCuentasDestinoCanonico || []).length) {
      controlCuenta.setValidators([Validators.required]);
    } else {
      controlCuenta.clearValidators();
      controlCuenta.setValue(null);
    }

    controlCuenta.updateValueAndValidity({ emitEvent: false });
  }

  private formatearFechaLocalSinZona(fecha: any): string {
    const source = fecha ? new Date(fecha) : new Date();
    const fechaValida = isNaN(source.getTime()) ? new Date() : source;
    const pad = (value: number) => `${value}`.padStart(2, '0');

    return `${fechaValida.getFullYear()}-${pad(fechaValida.getMonth() + 1)}-${pad(fechaValida.getDate())}`
      + `T${pad(fechaValida.getHours())}:${pad(fechaValida.getMinutes())}:${pad(fechaValida.getSeconds())}`;
  }

  registrarPagoCanonico() {
    if (this.formularioPagoCanonico.invalid) {
      Object.values(this.formularioPagoCanonico.controls).forEach(control => control.markAsTouched());
      return;
    }

    const nIdCliente = this.auxSaldoGeneralCliente?.tcCliente?.nId || this.auxSaldoGeneralCliente?.nIdCliente;
    const nIdDatoFactura = this.auxSaldoGeneralCliente?.tcCliente?.nIdDatoFactura;
    const formaPago = (this.listaFormaPagoCanonico || []).find(item => item?.nId === this.formularioPagoCanonico.get('idFormaPago').value);
    const cuentaDestino = (this.listaCuentasDestinoCanonico || []).find(item => item?.nId === this.formularioPagoCanonico.get('idCuentaDestino').value);
    if (!nIdCliente || !nIdDatoFactura || !formaPago?.nId || !cuentaDestino?.nId) {
      this.messageService.add({ severity: 'warn', summary: 'Datos incompletos', detail: 'No fue posible resolver cliente, razÃ³n social, forma de pago o cuenta destino.', life: 4000 });
      return;
    }

    const payload = new PagoClienteRegistroDto();
    payload.nIdCliente = nIdCliente;
    payload.nIdDatoFactura = nIdDatoFactura;
    payload.fechaPago = this.formatearFechaLocalSinZona(this.formularioPagoCanonico.get('fechaPago').value);
    payload.importeTotal = this.formularioPagoCanonico.get('importeTotal').value;
    payload.moneda = 'MXN';
    payload.nIdFormaPago = formaPago.nId;
    payload.formaPagoSat = formaPago.sClave;
    payload.descripcionFormaPago = formaPago.sDescripcion;
    payload.bancoDestino = cuentaDestino.sBanco;
    payload.cuentaDestino = cuentaDestino.sTerminacion;
    payload.ultimos4CuentaDestino = cuentaDestino.sTerminacion;
    payload.referencia = this.formularioPagoCanonico.get('referencia').value;
    payload.observaciones = this.formularioPagoCanonico.get('observaciones').value;
    payload.nIdUsuarioRegistro = this.tokenService.getIdUser();
    payload.nIdCaja = this.cajaActivaCanonico?.nId;
    payload.nIdCorteCaja = this.cajaActivaCanonico?.nId;

    this.procesandoPagoCanonico = true;
    this.pagoClienteService.registrarPago(payload).subscribe(() => {
      this.procesandoPagoCanonico = false;
      this.productDialogRegistroPagoCanonico = false;
      this.messageService.add({ severity: 'success', summary: 'Pago registrado', detail: 'Se registrÃ³ el pago global del cliente.', life: 4000 });
      if (this.auxSaldoGeneralCliente) {
        this.consultarPagosCanonicosCliente(this.auxSaldoGeneralCliente);
      }
    }, (error) => {
      this.procesandoPagoCanonico = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error || 'No fue posible registrar el pago global.', life: 5000 });
    });
  }

  irAFacturacionConsolidada(nIdCliente?: number, razonSocial?: string) {
    const clienteId = nIdCliente || this.auxSaldoGeneralCliente?.tcCliente?.nId || this.pagoCanonicoSeleccionado?.nIdCliente || this.tvVentasDetalle?.nIdCliente;
    const clienteNombre = razonSocial || this.auxSaldoGeneralCliente?.tcCliente?.sRazonSocial || this.tvVentasDetalle?.tcCliente?.sRazonSocial;
    this.router.navigate(['/caja/facturacion'], {
      queryParams: {
        nIdCliente: clienteId || null,
        cliente: clienteNombre || null,
        focoAnticipo: 1
      },
      queryParamsHandling: ''
    });
  }

  abrirDialogoAplicacionPagoCanonico(pago: PagoClienteDetalleDto) {
    if (!pago?.nId || !pago?.nIdCliente || !pago?.nIdDatoFactura) {
      this.messageService.add({ severity: 'warn', summary: 'Pago incompleto', detail: 'El pago seleccionado no tiene contexto suficiente para consultar las notas pendientes.', life: 4000 });
      return;
    }

    this.pagoCanonicoSeleccionado = pago;
    this.productDialogAplicacionPagoCanonico = true;
    this.listaFacturasPendientesPagoCanonico = [];
    this.procesandoPagoCanonico = true;
    this.filtroBusquedaFacturasPagoCanonico = '';
    this.filtroEstadoFacturasPagoCanonico = 'todos';

    this.pagoClienteService.consultarFacturasPendientes(pago.nIdCliente, pago.nIdDatoFactura).subscribe(data => {
      this.procesandoPagoCanonico = false;
      const facturas = (data || []).map(item => ({
        ...item,
        montoAplicarSeleccionado: 0
      }));
      this.listaFacturasPendientesPagoCanonico = this.ordenarFacturasPendientesPagoCanonico(facturas);
      this.filtroFacturasPagoCanonico = this.obtenerFiltroInicialFacturasPagoCanonico();
    }, () => {
      this.procesandoPagoCanonico = false;
      this.listaFacturasPendientesPagoCanonico = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar las notas pendientes para este pago global.', life: 4000 });
    });
  }

  obtenerEtiquetaCuentaDestino(cuenta: TcCuentaBancaria): string {
    if (!cuenta) {
      return 'N/D';
    }
    return `${cuenta.sBanco || 'Banco'} - ${cuenta.sTerminacion || 'Sin terminaciÃ³n'}`;
  }

  toggleSoloRepPendienteCanonico() {
    this.mostrarSoloRepPendienteCanonico = !this.mostrarSoloRepPendienteCanonico;
  }

  toggleSoloRepPendientePagoCanonico() {
    this.mostrarSoloRepPendientePagoCanonico = !this.mostrarSoloRepPendientePagoCanonico;
  }

  sugerirMontosManualPagoCanonico() {
    let disponible = Number(this.pagoCanonicoSeleccionado?.importeDisponible || 0);
    this.listaFacturasPendientesPagoCanonico = (this.listaFacturasPendientesPagoCanonico || []).map(factura => {
      const saldoPendiente = Number(factura?.saldoPendiente || 0);
      const monto = disponible > 0 ? Math.min(disponible, saldoPendiente) : 0;
      disponible = Math.max(disponible - monto, 0);
      return {
        ...factura,
        montoAplicarSeleccionado: monto
      };
    });
    this.recalcularMontosV2();
  }

  recalcularMontosV2() {
    // Angular recalculates the getters smoothly in the UI
  }

  private ordenarFacturasPendientesPagoCanonico(facturas: FacturaCreditoPendienteDto[]): FacturaCreditoPendienteDto[] {
    if (!this.nIdVentaObjetivoPagoCanonico) {
      return facturas;
    }

    return [...(facturas || [])].sort((left, right) => {
      const leftPrioridad = left?.nIdVenta === this.nIdVentaObjetivoPagoCanonico ? 0 : 1;
      const rightPrioridad = right?.nIdVenta === this.nIdVentaObjetivoPagoCanonico ? 0 : 1;
      if (leftPrioridad !== rightPrioridad) {
        return leftPrioridad - rightPrioridad;
      }
      return Number(left?.nIdVenta || 0) - Number(right?.nIdVenta || 0);
    });
  }

  private obtenerFiltroInicialFacturasPagoCanonico(): 'relacionables' | 'facturadas' | 'sin-factura' {
    if (this.totalFacturasRelacionablesPagoCanonico > 0) {
      return 'relacionables';
    }
    if (this.totalFacturasConFacturaPagoCanonico > 0) {
      return 'facturadas';
    }
    return 'sin-factura';
  }

  seleccionarFiltroFacturasPagoCanonico(filtro: 'relacionables' | 'facturadas' | 'sin-factura') {
    this.filtroFacturasPagoCanonico = filtro;
    this.sincronizarSeleccionFacturasPagoCanonicoVisible();
  }

  esFiltroFacturasPagoCanonicoActivo(filtro: 'relacionables' | 'facturadas' | 'sin-factura'): boolean {
    return this.filtroFacturasPagoCanonico === filtro;
  }

  esFacturaConFacturaParaFiltro(factura: FacturaCreditoPendienteDto): boolean {
    return !!factura && !factura.requiereFacturacion && factura.facturada !== false;
  }

  esFacturaRelacionableParaFiltro(factura: FacturaCreditoPendienteDto): boolean {
    return this.esFacturaConFacturaParaFiltro(factura) && this.esFacturaElegibleParaAplicacionGlobal(factura);
  }

  esFacturaConFacturaNoRelacionableParaFiltro(factura: FacturaCreditoPendienteDto): boolean {
    return this.esFacturaConFacturaParaFiltro(factura) && !this.esFacturaRelacionableParaFiltro(factura);
  }

  esFacturaSinFacturaParaFiltro(factura: FacturaCreditoPendienteDto): boolean {
    return !!factura && !this.esFacturaConFacturaParaFiltro(factura);
  }

  obtenerClaveEstadoFiscalFactura(factura: FacturaCreditoPendienteDto): 'relacionable' | 'facturada_no_ppd' | 'no_facturada' | 'cancelada' {
    if (!factura) {
      return 'no_facturada';
    }

    if (factura.requiereFacturacion || factura.facturada === false) {
      return 'no_facturada';
    }

    const estado = (factura.estadoFiscal || '').toUpperCase();
    if (estado.includes('CANCEL')) {
      return 'cancelada';
    }

    if (this.esFacturaElegibleParaAplicacionGlobal(factura)) {
      return 'relacionable';
    }

    return 'facturada_no_ppd';
  }

  onFiltroBusquedaFacturasPagoCanonicoChange(value: string) {
    this.filtroBusquedaFacturasPagoCanonico = value || '';
    this.sincronizarSeleccionFacturasPagoCanonicoVisible();
  }

  onFiltroEstadoFacturasPagoCanonicoChange(value: 'todos' | 'relacionable' | 'facturada_no_ppd' | 'no_facturada' | 'cancelada') {
    this.filtroEstadoFacturasPagoCanonico = value || 'todos';
    this.sincronizarSeleccionFacturasPagoCanonicoVisible();
  }

  limpiarFiltrosFacturasPagoCanonico() {
    this.filtroBusquedaFacturasPagoCanonico = '';
    this.filtroEstadoFacturasPagoCanonico = 'todos';
    this.sincronizarSeleccionFacturasPagoCanonicoVisible();
  }

  get tieneFiltrosTablaFacturasPagoCanonicoActivos(): boolean {
    return !!(this.filtroBusquedaFacturasPagoCanonico || '').trim() || this.filtroEstadoFacturasPagoCanonico !== 'todos';
  }

  private sincronizarSeleccionFacturasPagoCanonicoVisible() {
    const visiblesIds = new Set((this.listaFacturasPendientesPagoCanonicoVisible || []).map(item => item?.nIdVenta));
    this.selectedFacturas = (this.selectedFacturas || []).filter(item => visiblesIds.has(item?.nIdVenta));
    this.redistribuirMontosSeleccionados();
  }

  private normalizarTextoFacturaPagoCanonico(value: any): string {
    return `${value == null ? '' : value}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  private coincideBusquedaFacturaPagoCanonico(factura: FacturaCreditoPendienteDto): boolean {
    const busqueda = this.normalizarTextoFacturaPagoCanonico(this.filtroBusquedaFacturasPagoCanonico);
    if (!busqueda) {
      return true;
    }

    const fechaTexto = factura?.fechaVenta ? new Date(factura.fechaVenta).toLocaleString('es-MX') : '';
    const tokens = [
      factura?.nIdVenta,
      fechaTexto,
      factura?.totalVenta,
      factura?.totalAplicado,
      factura?.saldoPendiente,
      factura?.parcialidadActual,
      factura?.estadoFiscal,
      this.obtenerEtiquetaEstadoFiscalFactura(factura)
    ].map(item => this.normalizarTextoFacturaPagoCanonico(item));

    return tokens.some(item => item.includes(busqueda));
  }

  private coincideEstadoFacturaPagoCanonico(factura: FacturaCreditoPendienteDto): boolean {
    if (this.filtroEstadoFacturasPagoCanonico === 'todos') {
      return true;
    }

    return this.obtenerClaveEstadoFiscalFactura(factura) === this.filtroEstadoFacturasPagoCanonico;
  }

  private get listaFacturasPendientesPagoCanonicoPorPestana(): FacturaCreditoPendienteDto[] {
    const facturas = this.listaFacturasPendientesPagoCanonico || [];
    if (this.filtroFacturasPagoCanonico === 'relacionables') {
      return facturas.filter(item => this.esFacturaRelacionableParaFiltro(item));
    }
    if (this.filtroFacturasPagoCanonico === 'sin-factura') {
      return facturas.filter(item => this.esFacturaSinFacturaParaFiltro(item));
    }
    return facturas.filter(item => this.esFacturaConFacturaNoRelacionableParaFiltro(item));
  }

  get listaFacturasPendientesPagoCanonicoVisible(): FacturaCreditoPendienteDto[] {
    return (this.listaFacturasPendientesPagoCanonicoPorPestana || [])
      .filter(item => this.coincideEstadoFacturaPagoCanonico(item))
      .filter(item => this.coincideBusquedaFacturaPagoCanonico(item));
  }

  get totalFacturasRelacionablesPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonico || []).filter(item => this.esFacturaRelacionableParaFiltro(item)).length;
  }

  get totalFacturasConFacturaPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonico || []).filter(item => this.esFacturaConFacturaNoRelacionableParaFiltro(item)).length;
  }

  get totalFacturasSinFacturaPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonico || []).filter(item => this.esFacturaSinFacturaParaFiltro(item)).length;
  }

  get totalFacturasElegiblesPagoCanonicoVisible(): number {
    return (this.listaFacturasPendientesPagoCanonicoVisible || []).filter(item => this.esFacturaElegibleParaAplicacionGlobal(item)).length;
  }

  get totalFacturasPestanaActivaPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonicoPorPestana || []).length;
  }

  get mensajeVacioFacturasPagoCanonico(): string {
    if (this.tieneFiltrosTablaFacturasPagoCanonicoActivos) {
      return 'No hay notas que coincidan con los filtros aplicados.';
    }
    if (this.filtroFacturasPagoCanonico === 'relacionables') {
      return 'No hay notas relacionables en este cliente. Revisa las pestañas con factura o sin factura para identificar las pendientes.';
    }
    if (this.filtroFacturasPagoCanonico === 'sin-factura') {
      return 'No hay notas sin factura en este cliente.';
    }
    return 'No hay notas facturadas pendientes de ajuste en este cliente. Si existen PPD/99 listas para pago aparecerán en Relacionables.';
  }

  get tieneVentaObjetivoPagoCanonico(): boolean {
    return !!this.nIdVentaObjetivoPagoCanonico;
  }

  esVentaObjetivoPagoCanonico(factura: FacturaCreditoPendienteDto): boolean {
    return !!factura && !!this.nIdVentaObjetivoPagoCanonico && factura.nIdVenta === this.nIdVentaObjetivoPagoCanonico;
  }

  obtenerSeverityPagoCanonico(estado?: string): string {
    const value = (estado || '').toUpperCase();
    if (value.includes('TOTAL')) {
      return 'success';
    }
    if (value.includes('PARCIAL') || value.includes('REGISTRADO')) {
      return 'warning';
    }
    if (value.includes('SIN_PAGO')) {
      return 'secondary';
    }
    return 'info';
  }

  obtenerEtiquetaPagoGlobal(estado?: string): string {
    const value = (estado || '').toUpperCase();
    if (value.includes('TOTAL')) {
      return 'Saldo agotado';
    }
    if (value.includes('PARCIAL')) {
      return 'Saldo parcial asignado';
    }
    if (value.includes('REGISTRADO')) {
      return 'Disponible para asignar';
    }
    if (value.includes('SIN_PAGO')) {
      return 'Sin pago global';
    }
    return estado || 'Sin estado';
  }

  obtenerSeverityRepCanonico(estado?: string): string {
    const value = (estado || '').toUpperCase();
    if (value === 'TIMBRADO') {
      return 'success';
    }
    if (value === 'PENDIENTE') {
      return 'warning';
    }
    if (value === 'PENDIENTE_FACTURACION') {
      return 'info';
    }
    if (value === 'FALLIDO') {
      return 'danger';
    }
    return 'secondary';
  }

  obtenerEtiquetaRepCanonico(estado?: string): string {
    const value = (estado || '').toUpperCase();
    if (value === 'NO_REQUIERE') {
      return 'No requiere';
    }
    if (value === 'NO_FACTURADA') {
      return 'No facturada';
    }
    if (value === 'PENDIENTE_FACTURACION') {
      return 'Pendiente facturaciÃ³n';
    }
    if (value === 'SIN_APLICACIONES') {
      return 'Sin aplicaciones';
    }
    if (value === 'TIMBRADO') {
      return 'Timbrado';
    }
    if (value === 'PENDIENTE') {
      return 'Pendiente';
    }
    if (value === 'FALLIDO') {
      return 'Fallido';
    }
    return estado || 'Sin estado';
  }

  puedeTimbrarRepCanonico(venta: TvVentasDetalle): boolean {
    const estadoRep = (venta?.sEstadoRepCanonico || '').toUpperCase();
    return !!venta?.nIdPagoClienteCanonico && (estadoRep === 'PENDIENTE' || estadoRep === 'FALLIDO');
  }

  requiereFacturacionCanonica(venta: TvVentasDetalle): boolean {
    const estadoRep = (venta?.sEstadoRepCanonico || '').toUpperCase();
    return !!venta?.nIdPagoClienteCanonico && (estadoRep === 'NO_FACTURADA' || estadoRep === 'PENDIENTE_FACTURACION');
  }

  puedeTimbrarRepPagoCanonico(pago: PagoClienteDetalleDto): boolean {
    const estadoRep = (pago?.estadoRepCanonico || '').toUpperCase();
    return !!pago?.nId && (estadoRep === 'PENDIENTE' || estadoRep === 'FALLIDO');
  }

  requiereFacturacionPagoCanonico(pago: PagoClienteDetalleDto): boolean {
    const estadoRep = (pago?.estadoRepCanonico || '').toUpperCase();
    return !!pago?.nId && estadoRep === 'PENDIENTE_FACTURACION';
  }

  esVentaCanonicaAccionable(venta: TvVentasDetalle): boolean {
    return this.puedeTimbrarRepCanonico(venta) || this.requiereFacturacionCanonica(venta);
  }

  esPagoCanonicoAccionable(pago: PagoClienteDetalleDto): boolean {
    return this.puedeTimbrarRepPagoCanonico(pago) || this.requiereFacturacionPagoCanonico(pago);
  }

  get listaVentasDetalleClienteVisible(): TvVentasDetalle[] {
    const ventas = this.listaVentasDetalleCliente || [];
    if (!this.mostrarSoloRepPendienteCanonico) {
      return ventas;
    }
    return ventas.filter(venta => this.esVentaCanonicaAccionable(venta));
  }

  get totalRepCanonicoPendiente(): number {
    return (this.listaVentasDetalleCliente || []).filter(venta => this.puedeTimbrarRepCanonico(venta)).length;
  }

  get totalVentasCanonicasPendientesFacturacion(): number {
    return (this.listaVentasDetalleCliente || []).filter(venta => this.requiereFacturacionCanonica(venta)).length;
  }

  get totalRepCanonicoTimbrado(): number {
    return (this.listaVentasDetalleCliente || []).filter(venta => (venta?.sEstadoRepCanonico || '').toUpperCase() === 'TIMBRADO').length;
  }

  get listaPagosCanonicosClienteVisible(): PagoClienteDetalleDto[] {
    const pagos = this.listaPagosCanonicosCliente || [];
    if (!this.mostrarSoloRepPendientePagoCanonico) {
      return pagos;
    }
    return pagos.filter(pago => this.esPagoCanonicoAccionable(pago));
  }

  get totalPagosCanonicosRepPendiente(): number {
    return (this.listaPagosCanonicosCliente || []).filter(pago => (pago?.estadoRepCanonico || '').toUpperCase() === 'PENDIENTE').length;
  }

  get totalPagosCanonicosRepFallido(): number {
    return (this.listaPagosCanonicosCliente || []).filter(pago => (pago?.estadoRepCanonico || '').toUpperCase() === 'FALLIDO').length;
  }

  get totalPagosCanonicosRepTimbrado(): number {
    return (this.listaPagosCanonicosCliente || []).filter(pago => (pago?.estadoRepCanonico || '').toUpperCase() === 'TIMBRADO').length;
  }

  get totalPagosCanonicosPendientesFacturacion(): number {
    return (this.listaPagosCanonicosCliente || []).filter(pago => this.requiereFacturacionPagoCanonico(pago)).length;
  }

  get totalFacturasPendientesPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonico || []).length;
  }

  get totalMontoManualSeleccionadoPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonico || []).reduce((total, factura) => total + Number(factura?.montoAplicarSeleccionado || 0), 0);
  }

  obtenerTotalAplicacionesPagoCanonico(pago: PagoClienteDetalleDto): number {
    return pago?.aplicaciones ? pago.aplicaciones.length : 0;
  }

  obtenerResumenNotasPagoCanonico(pago: PagoClienteDetalleDto): string {
    const notas = ((pago?.aplicaciones || [])
      .map(item => item?.nIdVenta)
      .filter(item => !!item) as number[])
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => a - b);

    if (!notas.length) {
      return 'Sin notas ligadas';
    }

    const visibles = notas.slice(0, 4).join(', ');
    const resto = notas.length > 4 ? ` +${notas.length - 4}` : '';
    return `Notas: ${visibles}${resto}`;
  }

  obtenerPorcentajeAplicadoPagoCanonico(pago: PagoClienteDetalleDto): number {
    const total = Number(pago?.importeTotal || 0);
    const aplicado = Number(pago?.importeAplicado || 0);
    if (!total || total <= 0) {
      return 0;
    }
    return Math.min(Math.round((aplicado / total) * 100), 100);
  }

  obtenerEtiquetaSiguientePasoVenta(venta: TvVentasDetalle): string {
    if (this.puedeTimbrarRepCanonico(venta)) {
      return 'Generar complemento';
    }
    if (this.requiereFacturacionCanonica(venta)) {
      return 'Ir a facturaciÃ³n';
    }
    return 'Asignar pago';
  }

  obtenerIconoSiguientePasoVenta(venta: TvVentasDetalle): string {
    if (this.puedeTimbrarRepCanonico(venta)) {
      return 'pi pi-refresh';
    }
    if (this.requiereFacturacionCanonica(venta)) {
      return 'pi pi-external-link';
    }
    return 'pi pi-credit-card';
  }

  ejecutarSiguientePasoVenta(venta: TvVentasDetalle) {
    if (this.puedeTimbrarRepCanonico(venta)) {
      this.timbrarRepCanonico(venta);
      return;
    }
    if (this.requiereFacturacionCanonica(venta)) {
      this.irAFacturacionCanonica(venta?.nIdCliente, venta?.tcCliente?.sRazonSocial);
      return;
    }
    this.abrirPagosGlobalesParaVenta(venta);
  }

  obtenerEtiquetaSiguientePasoPago(pago: PagoClienteDetalleDto): string {
    if (this.puedeTimbrarRepPagoCanonico(pago)) {
      return 'Generar complemento';
    }
    if (this.requiereFacturacionPagoCanonico(pago)) {
      return 'Ir a facturaciÃ³n';
    }
    return 'Asignar a notas';
  }

  obtenerIconoSiguientePasoPago(pago: PagoClienteDetalleDto): string {
    if (this.puedeTimbrarRepPagoCanonico(pago)) {
      return 'pi pi-refresh';
    }
    if (this.requiereFacturacionPagoCanonico(pago)) {
      return 'pi pi-external-link';
    }
    return 'pi pi-pencil';
  }

  ejecutarSiguientePasoPago(pago: PagoClienteDetalleDto) {
    if (this.puedeTimbrarRepPagoCanonico(pago)) {
      this.timbrarRepPagoCanonico(pago);
      return;
    }
    if (this.requiereFacturacionPagoCanonico(pago)) {
      this.irAFacturacionCanonica(pago?.nIdCliente, this.auxSaldoGeneralCliente?.tcCliente?.sRazonSocial);
      return;
    }
    this.abrirDialogoAplicacionPagoCanonico(pago);
  }

  get totalImportePagosCanonicos(): number {
    return (this.listaPagosCanonicosCliente || []).reduce((acc, pago) => acc + Number(pago?.importeTotal || 0), 0);
  }

  get totalAplicadoPagosCanonicos(): number {
    return (this.listaPagosCanonicosCliente || []).reduce((acc, pago) => acc + Number(pago?.importeAplicado || 0), 0);
  }

  get totalDisponiblePagosCanonicos(): number {
    return (this.listaPagosCanonicosCliente || []).reduce((acc, pago) => acc + Number(pago?.importeDisponible || 0), 0);
  }

  get totalPagosConSaldoDisponible(): number {
    return (this.listaPagosCanonicosCliente || []).filter(pago => this.tieneSaldoDisponiblePago(pago)).length;
  }

  get listaPagosConSaldoDisponibleParaControl(): PagoClienteDetalleDto[] {
    return [...(this.listaPagosCanonicosCliente || [])]
      .filter(pago => this.tieneSaldoDisponiblePago(pago))
      .sort((a, b) => {
        const disponibleA = Number(a?.importeDisponible || 0);
        const disponibleB = Number(b?.importeDisponible || 0);
        if (disponibleA !== disponibleB) {
          return disponibleB - disponibleA;
        }
        return Number(b?.nId || 0) - Number(a?.nId || 0);
      });
  }

  get listaPagosCanonicosOrdenadosParaControl(): PagoClienteDetalleDto[] {
    return [...(this.listaPagosCanonicosCliente || [])].sort((a, b) => {
      const disponibleA = Number(a?.importeDisponible || 0);
      const disponibleB = Number(b?.importeDisponible || 0);
      if (disponibleA !== disponibleB) {
        return disponibleB - disponibleA;
      }
      return Number(b?.nId || 0) - Number(a?.nId || 0);
    });
  }

  get montoDisponibleParaAsignacionActual(): number {
    return this.obtenerMontoDisponibleParaAsignacion();
  }

  get tieneMontoDisponibleParaAsignacion(): boolean {
    return this.montoDisponibleParaAsignacionActual > 0;
  }

  activarUsoSaldoExistente() {
    const pagos = this.listaPagosConSaldoDisponibleParaControl || [];
    if (!pagos.length) {
      this.messageService.add({
        severity: 'info',
        summary: 'Sin saldo disponible',
        detail: 'No hay pagos globales con saldo para reutilizar. Registra un pago nuevo.',
        life: 4500
      });
      return;
    }

    this.seleccionarPagoGlobalExistente(pagos[0]);
  }

  seleccionarPagoGlobalExistentePorId(nIdPago: number) {
    const pago = (this.listaPagosConSaldoDisponibleParaControl || []).find(item => item?.nId === nIdPago);
    if (!pago) {
      return;
    }
    this.seleccionarPagoGlobalExistente(pago);
  }

  obtenerEtiquetaPagoDisponible(pago: PagoClienteDetalleDto): string {
    if (!pago) {
      return 'Pago no disponible';
    }

    const id = pago?.nId || 'N/D';
    const fecha = pago?.fechaPago ? new Date(pago.fechaPago).toLocaleDateString('es-MX') : 'Sin fecha';
    const disponible = Number(pago?.importeDisponible || 0).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `#${id} | ${fecha} | Disponible $${disponible}`;
  }

  get montoRestanteManualPagoCanonico(): number {
    const disponible = this.obtenerMontoDisponibleParaAsignacion();
    const restante = disponible - this.totalMontoManualSeleccionadoPagoCanonico;
    return restante > 0 ? restante : 0;
  }

  get excedeMontoDisponibleManualPagoCanonico(): boolean {
    const disponible = this.obtenerMontoDisponibleParaAsignacion();
    return this.totalMontoManualSeleccionadoPagoCanonico > disponible;
  }

  private obtenerMontoDisponibleParaAsignacion(): number {
    if (this.displayUnifiedPaymentDialog && this.usandoPagoGlobalExistente) {
      return Number(this.pagoCanonicoSeleccionado?.importeDisponible || 0);
    }

    if (this.displayUnifiedPaymentDialog) {
      return Number(this.formularioPagoCanonico?.get('importeTotal')?.value || 0);
    }
    return Number(this.pagoCanonicoSeleccionado?.importeDisponible || 0);
  }

  private redistribuirMontosSeleccionados(): void {
    let restante = this.obtenerMontoDisponibleParaAsignacion();
    const seleccionadasIds = new Set((this.selectedFacturas || []).map(item => item?.nIdVenta));
    const seleccionadas = (this.listaFacturasPendientesPagoCanonico || [])
      .filter(item => seleccionadasIds.has(item?.nIdVenta))
      .filter(item => this.esFacturaElegibleParaAplicacionGlobal(item));
    this.selectedFacturas = seleccionadas;

    (this.listaFacturasPendientesPagoCanonico || []).forEach(factura => {
      factura.montoAplicarSeleccionado = 0;
    });

    seleccionadas.forEach(factura => {
      const saldoPendiente = Number(factura?.saldoPendiente || 0);
      const montoAplicar = Math.min(restante, saldoPendiente);
      factura.montoAplicarSeleccionado = montoAplicar > 0 ? montoAplicar : 0;
      restante = Math.max(restante - montoAplicar, 0);
    });
  }

  get puedeGuardarAplicacionManual(): boolean {
    return this.totalMontoManualSeleccionadoPagoCanonico > 0 && !this.excedeMontoDisponibleManualPagoCanonico && !this.procesandoPagoCanonico;
  }

  get aplicacionesPagoCanonicoSeleccionado(): PagoAplicacionLineaDto[] {
    const aplicaciones = this.pagoCanonicoSeleccionado?.aplicaciones || [];
    return [...aplicaciones].sort((a, b) => {
      const ordenA = Number(a?.ordenAplicacion || 0);
      const ordenB = Number(b?.ordenAplicacion || 0);
      if (ordenA !== ordenB) {
        return ordenA - ordenB;
      }
      return Number(a?.nIdVenta || 0) - Number(b?.nIdVenta || 0);
    });
  }

  get totalAplicacionesPagoCanonicoSeleccionado(): number {
    return (this.aplicacionesPagoCanonicoSeleccionado || []).length;
  }

  get totalMontoAplicacionesPagoCanonicoSeleccionado(): number {
    return (this.aplicacionesPagoCanonicoSeleccionado || []).reduce((total, item) => total + Number(item?.montoAplicado || 0), 0);
  }

  get porcentajeAplicadoPagoCanonicoSeleccionado(): number {
    return this.obtenerPorcentajeAplicadoPagoCanonico(this.pagoCanonicoSeleccionado || {});
  }

  obtenerEtiquetaAplicacionPagoCanonico(aplicacion: PagoAplicacionLineaDto): string {
    if (!aplicacion) {
      return 'Sin estado';
    }

    const estatus = (aplicacion.estatus || '').toUpperCase();
    if (estatus.includes('TIMBRADO')) {
      return 'Complemento timbrado';
    }
    if (estatus.includes('PENDIENTE_FACTURACION')) {
      return 'Pendiente facturaciÃ³n';
    }
    if (estatus.includes('PENDIENTE')) {
      return 'Pendiente complemento';
    }
    if (estatus.includes('ERROR') || estatus.includes('FALLIDO')) {
      return 'Error complemento';
    }
    if (estatus.includes('APLICADA')) {
      return 'Aplicada';
    }
    return aplicacion.estatus || 'Aplicada';
  }

  obtenerSeverityAplicacionPagoCanonico(aplicacion: PagoAplicacionLineaDto): string {
    if (!aplicacion) {
      return 'secondary';
    }

    const estatus = (aplicacion.estatus || '').toUpperCase();
    if (estatus.includes('TIMBRADO')) {
      return 'success';
    }
    if (estatus.includes('PENDIENTE_FACTURACION')) {
      return 'warning';
    }
    if (estatus.includes('PENDIENTE')) {
      return 'info';
    }
    if (estatus.includes('ERROR') || estatus.includes('FALLIDO')) {
      return 'danger';
    }
    return 'secondary';
  }

  aplicarPagoCanonicoAutomatico() {
    if (!this.pagoCanonicoSeleccionado?.nId) {
      return;
    }
    const payload = new PagoAplicacionAutomaticaRequestDto();
    payload.nIdUsuario = this.tokenService.getIdUser();
    payload.origenRegistro = 'UI_CREDITOS_AUTOMATICA';

    this.procesandoPagoCanonico = true;
    this.pagoClienteService.aplicarAutomatico(this.pagoCanonicoSeleccionado.nId, payload).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'AsignaciÃ³n automÃ¡tica', detail: 'El saldo del pago global se asignÃ³ automÃ¡ticamente a las notas elegibles.', life: 4000 });
      this.ejecutarComplementoPagoGlobalDespuesDeAplicar(this.pagoCanonicoSeleccionado.nId, () => {
        this.procesandoPagoCanonico = false;
        this.recargarContextoPagoCanonico();
      });
    }, (error) => {
      this.procesandoPagoCanonico = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error || 'No fue posible asignar el pago global automÃ¡ticamente.', life: 5000 });
    });
  }

  aplicarPagoCanonicoManual() {
    if (this.procesandoPagoCanonico) {
      return;
    }

    if (!this.pagoCanonicoSeleccionado?.nId) {
      return;
    }

    const lineas: PagoAplicacionManualLineaDto[] = (this.listaFacturasPendientesPagoCanonico || [])
      .filter(factura => this.esFacturaElegibleParaAplicacionGlobal(factura))
      .filter(factura => Number(factura?.montoAplicarSeleccionado || 0) > 0)
      .map(factura => {
        const linea = new PagoAplicacionManualLineaDto();
        linea.nIdVenta = factura.nIdVenta;
        linea.montoAplicar = Number(factura.montoAplicarSeleccionado || 0);
        return linea;
      });

    if (!lineas.length) {
      this.messageService.add({ severity: 'warn', summary: 'Sin importes', detail: 'Captura al menos un importe para asignar a las notas.', life: 4000 });
      return;
    }

    if (this.excedeMontoDisponibleManualPagoCanonico) {
      this.messageService.add({ severity: 'warn', summary: 'Importe excedido', detail: 'El total seleccionado supera el saldo disponible del pago global.', life: 4500 });
      return;
    }

    const payload = new PagoAplicacionManualRequestDto();
    payload.nIdUsuario = this.tokenService.getIdUser();
    payload.origenRegistro = 'UI_CREDITOS_MANUAL';
    payload.lineas = lineas;

    this.procesandoPagoCanonico = true;
    this.spinner.show();
    this.pagoClienteService.aplicarManual(this.pagoCanonicoSeleccionado.nId, payload).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'AsignaciÃ³n guardada', detail: 'El saldo del pago global se asignÃ³ a las notas seleccionadas.', life: 4000 });
      this.ejecutarComplementoPagoGlobalDespuesDeAplicar(this.pagoCanonicoSeleccionado.nId, () => {
        this.finalizarTransaccionGuardadoPago();
        this.recargarContextoPagoCanonico();
      });
    }, (error) => {
      this.finalizarTransaccionGuardadoPago();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: error?.error || 'No fue posible guardar la asignaciÃ³n del pago global.', life: 5000 });
    });
  }

  private recargarContextoPagoCanonico() {
    if (!this.auxSaldoGeneralCliente) {
      return;
    }
    const nIdCliente = this.auxSaldoGeneralCliente?.tcCliente?.nId || this.auxSaldoGeneralCliente?.nIdCliente;
    const nIdDatoFactura = this.auxSaldoGeneralCliente?.tcCliente?.nIdDatoFactura;
    this.cargarPagosGlobalesCliente(nIdCliente);
    if (nIdCliente && nIdDatoFactura) {
      this.cargarFacturasPendientesCliente(nIdCliente, nIdDatoFactura);
    }
    this.consultaSaldosCliente();
  }

  timbrarRepCanonico(venta: TvVentasDetalle) {
    if (!venta?.nIdPagoClienteCanonico) {
      return;
    }

    this.facturaService.facturarComplementoPagoCliente(venta.nIdPagoClienteCanonico).subscribe(resultado => {
      this.messageService.add({
        severity: resultado?.success ? 'success' : 'warn',
        summary: resultado?.success ? 'Complemento generado' : 'Complemento pendiente',
        detail: resultado?.mensajeError || resultado?.mensaje || 'Se procesÃ³ el complemento relacionado con este pago.',
        life: 5000
      });
      if (this.auxSaldoGeneralCliente) {
        this.consultaVentaDetalleId(this.auxSaldoGeneralCliente);
      }
      this.consultaSaldosCliente();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible generar el complemento relacionado con este pago.', life: 4000 });
    });
  }

  timbrarRepPagoCanonico(pago: PagoClienteDetalleDto) {
    if (!pago?.nId) {
      return;
    }

    this.facturaService.facturarComplementoPagoCliente(pago.nId).subscribe(resultado => {
      this.messageService.add({
        severity: resultado?.success ? 'success' : 'warn',
        summary: resultado?.success ? 'Complemento generado' : 'Complemento pendiente',
        detail: resultado?.mensajeError || resultado?.mensaje || 'Se procesÃ³ el complemento relacionado con este pago.',
        life: 5000
      });
      if (this.auxSaldoGeneralCliente) {
        this.consultarPagosCanonicosCliente(this.auxSaldoGeneralCliente);
        this.consultaVentaDetalleId(this.auxSaldoGeneralCliente);
      }
      this.consultaSaldosCliente();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible generar el complemento de este pago.', life: 4000 });
    });
  }

  irAFacturacionCanonica(nIdCliente?: number, razonSocial?: string) {
    const clienteId = nIdCliente || this.auxSaldoGeneralCliente?.tcCliente?.nId || this.pagoCanonicoSeleccionado?.nIdCliente || this.tvVentasDetalle?.nIdCliente;
    const clienteNombre = razonSocial || this.auxSaldoGeneralCliente?.tcCliente?.sRazonSocial || this.tvVentasDetalle?.tcCliente?.sRazonSocial;
    this.router.navigate(['/caja/facturacion'], {
      queryParams: {
        nIdCliente: clienteId || null,
        cliente: clienteNombre || null,
        focoAnticipo: 1
      },
      queryParamsHandling: ''
    });
  }

  onFacturaSelect(event: any) {
    const factura = event?.data;
    if (!factura) {
      return;
    }
    this.redistribuirMontosSeleccionados();
  }

  onFacturaUnselect(event: any) {
    const factura = event?.data;
    if (!factura) {
      return;
    }

    factura.montoAplicarSeleccionado = 0;
    this.redistribuirMontosSeleccionados();
  }

  esFacturaElegibleParaAplicacionGlobal(factura: FacturaCreditoPendienteDto): boolean {
    if (!factura) {
      return false;
    }

    if (factura.requiereFacturacion || factura.facturada === false) {
      return false;
    }

    const estado = (factura.estadoFiscal || '').toUpperCase();
    if (estado.includes('CANCEL')) {
      return false;
    }

    return estado.includes('PPD_99');
  }

  obtenerEtiquetaEstadoFiscalFactura(factura: FacturaCreditoPendienteDto): string {
    if (!factura) {
      return 'Sin estado';
    }
    if (factura.requiereFacturacion || factura.facturada === false) {
      return 'No facturada';
    }

    const estado = (factura.estadoFiscal || '').toUpperCase();
    if (estado.includes('PPD_99')) {
      return 'Facturada PPD/99';
    }
    if (estado.includes('FACTURA_EMITIDA')) {
      return 'Facturada sin PPD/99';
    }
    if (estado.includes('CANCEL')) {
      return 'Factura cancelada';
    }
    return 'Facturada';
  }

  obtenerSeverityEstadoFiscalFactura(factura: FacturaCreditoPendienteDto): string {
    if (!factura) {
      return 'secondary';
    }
    if (factura.requiereFacturacion || factura.facturada === false) {
      return 'warning';
    }

    const estado = (factura.estadoFiscal || '').toUpperCase();
    if (estado.includes('CANCEL')) {
      return 'danger';
    }
    if (estado.includes('PPD_99')) {
      return 'success';
    }
    if (estado.includes('FACTURA_EMITIDA')) {
      return 'warning';
    }
    return 'secondary';
  }

  get totalFacturasElegiblesPagoCanonico(): number {
    return (this.listaFacturasPendientesPagoCanonico || []).filter(item => this.esFacturaElegibleParaAplicacionGlobal(item)).length;
  }

  onFacturasSelectionChange(selection: FacturaCreditoPendienteDto[]) {
    const elegibles = (selection || []).filter(item => this.esFacturaElegibleParaAplicacionGlobal(item));
    if ((selection || []).length !== elegibles.length) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ventas no elegibles',
        detail: 'Solo se pueden relacionar ventas facturadas en PPD/99 y vigentes para aplicar un pago global.',
        life: 4500
      });
    }
    this.selectedFacturas = elegibles;
    this.redistribuirMontosSeleccionados();
  }

  private ejecutarComplementoPagoGlobalDespuesDeAplicar(nIdPagoCliente: number, onFinalize: () => void): void {
    if (!nIdPagoCliente) {
      onFinalize();
      return;
    }

    this.facturaService.facturarComplementoPagoCliente(nIdPagoCliente).subscribe(resultado => {
      if (resultado?.success) {
        this.messageService.add({
          severity: 'success',
          summary: 'Complemento generado',
          detail: resultado?.mensaje || 'Se generÃ³ el complemento de pago para las ventas relacionadas.',
          life: 5000
        });
      } else {
        this.messageService.add({
          severity: 'warn',
          summary: 'Complemento pendiente',
          detail: resultado?.mensajeError || resultado?.mensaje
            || 'La aplicaciÃ³n se guardÃ³, pero el complemento de pago quedÃ³ pendiente.',
          life: 5500
        });
      }
      onFinalize();
    }, () => {
      this.messageService.add({
        severity: 'warn',
        summary: 'Complemento pendiente',
        detail: 'La aplicaciÃ³n se guardÃ³, pero ocurriÃ³ un problema al generar el complemento de pago.',
        life: 5500
      });
      onFinalize();
    });
  }

  guardarOperacionPagoGlobal() {
    if (this.usandoPagoGlobalExistente) {
      this.aplicarPagoCanonicoManual();
      return;
    }

    this.registrarYAsignarPago();
  }

  get puedeGuardarOperacionPagoGlobal(): boolean {
    if (this.procesandoPagoCanonico) {
      return false;
    }

    if (this.usandoPagoGlobalExistente) {
      return this.puedeGuardarAplicacionManual;
    }

    return !!this.formularioPagoCanonico?.valid;
  }

  registrarYAsignarPago() {
    if (this.procesandoPagoCanonico) {
      return;
    }

    if (this.formularioPagoCanonico.invalid) {
      Object.values(this.formularioPagoCanonico.controls).forEach(c => c.markAsTouched());
      this.messageService.add({severity: 'warn', summary: 'Datos requeridos', detail: 'Por favor, completa los datos del pago.', life: 4000});
      return;
    }

    const tieneFacturasSeleccionadas = !!this.selectedFacturas && this.selectedFacturas.length > 0;
    if (tieneFacturasSeleccionadas && this.totalMontoManualSeleccionadoPagoCanonico <= 0) {
      this.messageService.add({severity: 'warn', summary: 'Sin monto a aplicar', detail: 'Aumenta el importe del pago o selecciona facturas con saldo pendiente para asignar.', life: 4500});
      return;
    }

    const valPago = this.formularioPagoCanonico.value;
    const nIdCliente = this.auxSaldoGeneralCliente?.tcCliente?.nId || this.auxSaldoGeneralCliente?.nIdCliente;
    const nIdDatoFactura = this.auxSaldoGeneralCliente?.tcCliente?.nIdDatoFactura;
    
    // Obtener objetos de formaPago y cuentaDestino para tener sus detalles
    const formaPago = (this.listaFormaPagoCanonico || []).find(f => f.nId === valPago.idFormaPago);
    const cuentaDestino = (this.listaCuentasDestinoCanonico || []).find(c => c.nId === valPago.idCuentaDestino);
    const requiereCuentaDestino = (this.listaCuentasDestinoCanonico || []).length > 0;

    if (!nIdCliente || !nIdDatoFactura || !formaPago || (requiereCuentaDestino && !cuentaDestino)) {
      this.messageService.add({severity: 'warn', summary: 'Datos incompletos', detail: 'Verifica cliente, razÃ³n social, forma de pago y cuenta destino (si aplica).', life: 4000});
      return;
    }

    // Calcular el monto total a pagar de acuerdo a las facturas seleccionadas
    const totalA_Pagar = Number((this.selectedFacturas || []).reduce((sum, f) => sum + (f.saldoPendiente || 0), 0).toFixed(2));
    // El pago se registrarÃ¡ por el monto correspondiente a las facturas, o segÃºn el formulario si es distinto (aquÃ­ se prioriza lo que se capturarÃ­a, o en este caso igualaremos al total, asumiendo pago exacto). Ajustar si el usuario captura monto.
    let importePago = valPago.importeTotal;
    if(!importePago || importePago <= 0) {
       importePago = totalA_Pagar;
    }

    const payloadPago = new PagoClienteRegistroDto();
    payloadPago.nIdCliente = nIdCliente;
    payloadPago.nIdDatoFactura = nIdDatoFactura;
    payloadPago.fechaPago = this.formatearFechaLocalSinZona(valPago.fechaPago);
    payloadPago.importeTotal = importePago;
    payloadPago.moneda = 'MXN';
    payloadPago.nIdFormaPago = formaPago.nId;
    payloadPago.formaPagoSat = formaPago.sClave;
    payloadPago.descripcionFormaPago = formaPago.sDescripcion;
    payloadPago.bancoDestino = cuentaDestino?.sBanco;
    payloadPago.cuentaDestino = cuentaDestino?.sTerminacion;
    payloadPago.ultimos4CuentaDestino = cuentaDestino?.sTerminacion;
    payloadPago.referencia = valPago.referencia;
    payloadPago.observaciones = valPago.observaciones;
    payloadPago.nIdUsuarioRegistro = this.tokenService.getIdUser();
    payloadPago.nIdCaja = this.cajaActivaCanonico?.nId;
    payloadPago.nIdCorteCaja = this.cajaActivaCanonico?.nId;

    this.procesandoPagoCanonico = true;
  this.spinner.show();

    // TODO: Ideally we create the payment and THEN allocate the lines, since we need nId of newly created payment.
    // However, depending on backend implementation, there might be an all-in-one endpoint, or we do it sequentially.
    // Because requirements state "registrarYAsignarPago", we will call register, map ID, then apply lines.
    
    this.pagoClienteService.registrarPago(payloadPago).subscribe((res: any) => {
        // Asumiendo que res retorna el nId del pago creado o el objeto completo
        const nuevoPagoId = res?.nId || res?.data?.nId; 
        
        if (nuevoPagoId) {
             const manualPayload = new PagoAplicacionManualRequestDto();
             manualPayload.nIdUsuario = this.tokenService.getIdUser();
             manualPayload.origenRegistro = 'UI_CREDITOS_UNIFICADO';
             
             // Distribuir el importe entre las seleccionadas secuencialmente (FIFO)
             let restante = importePago;
             const lineas: PagoAplicacionManualLineaDto[] = [];
             
               for(const f of (this.selectedFacturas || []).filter(item => this.esFacturaElegibleParaAplicacionGlobal(item))) {
                 if (restante <= 0) break;
                 const montoAplicar = Math.min(restante, f.saldoPendiente || 0);
                 const linea = new PagoAplicacionManualLineaDto();
                 linea.nIdVenta = f.nIdVenta;
                 linea.montoAplicar = montoAplicar;
                 lineas.push(linea);
                 restante -= montoAplicar;
             }
             
             manualPayload.lineas = lineas;

               if (!lineas.length) {
                 this.finalizarTransaccionGuardadoPago();
                 this.messageService.add({ severity: 'success', summary: 'Pago registrado', detail: 'El pago global se guardÃ³ con saldo disponible para asignar despuÃ©s.', life: 4500 });
                 this.activarRegistroNuevoPago();
                 this.recargarContextoPagoCanonico();
                 return;
               }
             
               this.pagoClienteService.aplicarManual(nuevoPagoId, manualPayload).subscribe(resAsig => {
                  this.messageService.add({ severity: 'success', summary: 'Ã‰xito', detail: 'Pago registrado y asignado correctamente.', life: 4000 });
                this.ejecutarComplementoPagoGlobalDespuesDeAplicar(nuevoPagoId, () => {
                 this.finalizarTransaccionGuardadoPago();
                 this.activarRegistroNuevoPago();
                 this.recargarContextoPagoCanonico();
                });
             }, err => {
                  this.finalizarTransaccionGuardadoPago();
                  this.messageService.add({ severity: 'error', summary: 'AtenciÃ³n', detail: 'Se registrÃ³ el pago pero fallÃ³ la asignaciÃ³n. ' + (err?.error || ''), life: 5000 });
                  this.recargarContextoPagoCanonico();
             });
        } else {
            // Si el backend no retorna el ID, podrÃ­amos recargar la vista pero no podemos asignar autÃ³maticamente en seco.
            this.finalizarTransaccionGuardadoPago();
            this.messageService.add({ severity: 'success', summary: 'Pago registrado', detail: 'Pago creado. Por favor asigne manualmente.', life: 4000 });
          this.activarRegistroNuevoPago();
            this.recargarContextoPagoCanonico();
        }
    }, err => {
        this.finalizarTransaccionGuardadoPago();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error || 'Error al registrar el pago.', life: 5000 });
    });
  }

  obtenerAccionesClienteCredito(cliente: SaldoGeneralCliente): MenuItem[] {
    return [
      {
        label: 'Pagos SAT',
        icon: 'pi pi-receipt',
        command: () => this.abrirDialogoConsultaPagosSat(cliente)
      },
      {
        label: 'Historial PDF',
        icon: 'pi pi-file-pdf',
        command: () => this.genenerHistorialAbonoVentaPDF(cliente)
      }
    ];
  }

  private finalizarTransaccionGuardadoPago(): void {
    this.procesandoPagoCanonico = false;
    this.spinner.hide();
  }

  deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: 'Realmente quieres borrar el cliente ' + product.name + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => val.id !== product.id);
              this.product = {};
              this.messageService.add({severity: 'success', summary: 'Se realizÃ³ con Ã©xito', detail: 'Cliente eliminado', life: 3000});
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this
      .submitted = false;
  }
  hideDialog2() {
    this.productDialog2 = false;
    this.submitted = false;
}

  hideDialogPagosCanonicos() {
    this.productDialogPagosCanonicos = false;
    this.nIdVentaObjetivoPagoCanonico = null;
    this.submitted = false;
  }

  hideDialogRegistroPagoCanonico() {
    this.productDialogRegistroPagoCanonico = false;
    this.submitted = false;
  }

  hideDialogAplicacionPagoCanonico() {
    this.productDialogAplicacionPagoCanonico = false;
    this.nIdVentaObjetivoPagoCanonico = null;
    this.submitted = false;
  }


  saveProduct() {
      this.submitted = true;

      if (this.product.name.trim()) {
          if (this.product.id) {
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({severity: 'success', summary: 'Se realizÃ³ con Ã©xito', detail: 'Cliente actualizado', life: 10000});
          }
          else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({severity: 'success', summary: 'Se realizÃ³ con Ã©xito', detail: 'Cliente guardado', life: 10000});
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( let i = 0; i < 5; i++ ) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }
  

  

  get validaAbono() {
    return this.formulario.get('abono').invalid && this.formulario.get('abono').touched;
  }
  get validaFormaPago() {
    return this.formulario.get('idFormaPago').invalid && this.formulario.get('idFormaPago').touched;
  }

  

  

}



import { Component, OnInit } from '@angular/core';
import {  MenuItem, MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from '../../../shared/service/factura.service';
import { TvVentasFactura } from '../../../productos/model/TvVentasFactura';
import { TcUsoCfdi } from '../../../productos/model/TcUsoCfdi';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TipoDoc } from 'src/app/shared/utils/TipoDoc.enum';
import { TcCliente } from '../../../administracion/model/TcCliente';
import { TcFormaPago } from 'src/app/productos/model/TcFormaPago';
import { VentasService } from '../../../shared/service/ventas.service';
import { TrVentaCobro } from '../../../productos/model/TrVentaCobro';
import { SubirFacturaDto } from '../../../productos/model/SubirFacturaDto';
import { CancelacionFacturaDto } from '../../../productos/model/CancelacionFacturaDto';
import { ResultadoFacturacionVentaDto } from '../../../productos/model/ResultadoFacturacionVentaDto';
import { StatusCfdiResponse } from '../../../productos/model/StatusCfdiResponse';
import { CfdiRelacionadosResponse } from '../../../productos/model/CfdiRelacionadosResponse';
import { SolicitudCancelacionDto } from '../../../productos/model/SolicitudCancelacionDto';
import { SolicitudCancelacionAccionDto } from '../../../productos/model/SolicitudCancelacionAccionDto';
import { DatosFacturaDto } from '../../../productos/model/DatosFacturaDto';
import { ComplementoPagoHistorialDto } from '../../../productos/model/ComplementoPagoHistorialDto';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

  private readonly usoCfdiComplemento = 'CP01';

    listaVentas:TvVentasFactura[];
    ventasSeleccionadas:TvVentasFactura[];
    ventasConsolidadasActuales:TvVentasFactura[];
    listaUsoCfdi:TcUsoCfdi[];
    formFactura:boolean;
    idVenta:number;
    totalVenta:number;
    cfdiSeleccionado:string;
    tvVentasFactura:TvVentasFactura;
    clienteDialog:boolean;
    objCliente: TcCliente;
    creditosRestantes:number;
    ListaTrVentaCobro: TrVentaCobro[];
    nuevaFormaPago:string;
    efectivoValida:boolean;
    subirFacturaDto:SubirFacturaDto;
    mostrarFormularioFactura:boolean;
    formData: FormData = new FormData();
    venta:string;
    uuid:string;
    file: File | null = null;
    fileXml: File | null = null;
    pdf:boolean;
    xml:boolean;
    mostrarDialogoCancelacion:boolean;
    motivoCancelacion:string;
    folioFiscalSustitucion:string;
    ventaCancelar?: TvVentasFactura;
    mostrarDialogoEstatusSat:boolean;
    mostrarDialogoRelacionados:boolean;
    mostrarDialogoSolicitudesPendientes:boolean;
    mostrarDialogoComplementos:boolean;
    mostrarDialogoAccionesVenta:boolean;
    mostrarDialogoFacturaConsolidada:boolean;
    estatusSat: StatusCfdiResponse;
    cfdiRelacionados: CfdiRelacionadosResponse;
    listaSolicitudesPendientes: SolicitudCancelacionDto[];
    listaDatosFactura: DatosFacturaDto[];
    nIdDatoFacturaSeleccionado?: number;
    cargandoSolicitudes:boolean;
    hayTimbresDisponibles:boolean;
    creditosTotales:number;
    mostrarSoloFacturadas:boolean;
    historialComplementos: ComplementoPagoHistorialDto[];
    cargandoComplementos:boolean;
    filtroEstadoHistorialComplemento:string;
    filtroParcialidadHistorialComplemento?: number;
    mostrarDialogoVistaPreviaComplemento:boolean;
    tituloVistaPreviaComplemento:string;
    urlVistaPreviaComplemento:string | null;
    vistaFacturadas:boolean;
    vistaSeleccionada:string;
    modoFacturacionConsolidada:boolean;
    ventasFacturaConsolidadaActual: TvVentasFactura[];
    clienteFiltroCanonicoId?: number;
    clienteFiltroCanonicoNombre:string;
    focoAnticipoCanonico:boolean;
    autoAperturaContextoCanonicoRealizada:boolean;
    cargandoFacturadas:boolean;
    periodoFacturadas:string;
    fechaInicioFacturadas: Date | null;
    fechaFinFacturadas: Date | null;
    estatusFacturadas:string;
    busquedaFacturadas:string;

    readonly filtrosEstadoHistorialComplemento = [
      { label: 'Todos', value: 'TODOS' },
      { label: 'Timbrados', value: 'TIMBRADOS' },
      { label: 'Fallidos', value: 'FALLIDOS' },
      { label: 'Reemplazados', value: 'REEMPLAZADOS' }
    ];

    readonly motivosCancelacion = [
      { label: '01 - Comprobante emitido con errores con relaciÃ³n', value: '01' },
      { label: '02 - Comprobante emitido con errores sin relaciÃ³n', value: '02' },
      { label: '03 - No se llevÃ³ a cabo la operaciÃ³n', value: '03' },
      { label: '04 - OperaciÃ³n nominativa relacionada en factura global', value: '04' }
    ];

    readonly periodosFacturadas = [
      { label: '60 dÃ­as', value: '60D' },
      { label: '3 meses', value: '3M' },
      { label: '6 meses', value: '6M' },
      { label: 'Rango', value: 'CUSTOM' }
    ];

    readonly filtrosEstadoFacturadas = [
      { label: 'Todos', value: 'TODOS' },
      { label: 'CFDI vigentes', value: 'FACTURADA' },
      { label: 'CFDI cancelados', value: 'CANCELADA' },
      { label: 'REP pendientes', value: 'REP_PENDIENTE' },
      { label: 'REP timbrados', value: 'REP_TIMBRADO' },
      { label: 'REP fallidos', value: 'REP_FALLIDO' },
      { label: 'Pendiente por facturar REP', value: 'REP_PENDIENTE_FACTURACION' }
    ];

    

  constructor(private facturaService: FacturaService, private catalogoService:CatalogoService, private messageService: MessageService, private ventasService: VentasService, private route: ActivatedRoute, private router: Router) {
        this.listaVentas=[];
        this.ventasSeleccionadas=[];
        this.ventasConsolidadasActuales=[];
        this.listaUsoCfdi=[];
        this.formFactura=false;
        this.tvVentasFactura= new TvVentasFactura();
        this.clienteDialog= false;
        this.objCliente= new TcCliente();
        this.creditosRestantes=0;
        this.nuevaFormaPago='';
        this.efectivoValida=false;
        this.subirFacturaDto=new SubirFacturaDto();
        this.mostrarDialogoCancelacion = false;
        this.motivoCancelacion = '';
        this.folioFiscalSustitucion = '';
          this.mostrarDialogoEstatusSat = false;
          this.mostrarDialogoRelacionados = false;
          this.mostrarDialogoSolicitudesPendientes = false;
          this.mostrarDialogoComplementos = false;
          this.mostrarDialogoAccionesVenta = false;
          this.mostrarDialogoFacturaConsolidada = false;
          this.estatusSat = new StatusCfdiResponse();
          this.cfdiRelacionados = new CfdiRelacionadosResponse();
          this.listaSolicitudesPendientes = [];
          this.listaDatosFactura = [];
          this.cargandoSolicitudes = false;
          this.hayTimbresDisponibles = false;
          this.creditosTotales = 0;
          this.mostrarSoloFacturadas = false;
          this.historialComplementos = [];
          this.cargandoComplementos = false;
          this.filtroEstadoHistorialComplemento = 'TODOS';
          this.mostrarDialogoVistaPreviaComplemento = false;
          this.tituloVistaPreviaComplemento = '';
          this.urlVistaPreviaComplemento = null;
          this.vistaFacturadas = false;
          this.vistaSeleccionada = 'pendientes';
          this.modoFacturacionConsolidada = false;
          this.ventasFacturaConsolidadaActual = [];
          this.clienteFiltroCanonicoNombre = '';
          this.focoAnticipoCanonico = false;
          this.autoAperturaContextoCanonicoRealizada = false;
          this.cargandoFacturadas = false;
          this.periodoFacturadas = '60D';
          this.fechaInicioFacturadas = null;
          this.fechaFinFacturadas = null;
          this.estatusFacturadas = 'TODOS';
          this.busquedaFacturadas = '';
     }

  ngOnInit(){
           this.route.queryParams.subscribe(params => {
            const clienteId = params?.nIdCliente != null && params?.nIdCliente !== '' ? Number(params.nIdCliente) : undefined;
            this.clienteFiltroCanonicoId = clienteId != null && !Number.isNaN(clienteId) ? clienteId : undefined;
            this.clienteFiltroCanonicoNombre = params?.cliente ? String(params.cliente) : '';
            this.focoAnticipoCanonico = params?.focoAnticipo === '1' || params?.focoAnticipo === 1;
            this.autoAperturaContextoCanonicoRealizada = false;
            this.refrescarListadoActual();
           });
   this.obtenerUsocfdi();
    this.obtenerCatalogoRazonSocial();


    
  }

  onSubmit(){
 
   if(this.venta!=null && this.uuid!=null && this.pdf && this.xml ){
    

    this.formData.append('venta',this.venta);
   this.formData.append('uuid',this.uuid);   
  
    this.facturaService.subirDocumento(this.formData).subscribe(data=>{
      
      this.formData= new FormData();
      this.subirFacturaDto=data;
      this.obtenerFacruras();
      this.mostrarFormularioFactura=false;

    });

   }

   else {

    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Se requieren todos los datos', life: 3000 });

   }

   
   


  }

  mostrarformularioFactura(venta:number){
    this.mostrarFormularioFactura=true;
    this.venta=venta.toString();
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.formData.append('file', file);
      this.pdf=true;
    }
  }

  onFileChangeXml(event: any) {
    
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const fileXml: File = fileList[0];
      this.formData.append('fileXml', fileXml);
      this.xml=true;
    }
  }


  onFileSelected(event: any ): void {
    
  }

  obtenerUsocfdi(){
    this.catalogoService.obtenerUsoCfdi().subscribe(resp =>{
      this.listaUsoCfdi=resp;
    });

  }

  obtenerCatalogoRazonSocial(){
    this.catalogoService.obtenerCatalogoRazonSocial().subscribe(resp => {
    this.listaDatosFactura = resp || [];
    this.nIdDatoFacturaSeleccionado = this.resolverRazonSocialSeleccionadaId();
    this.consultaCreditos(this.nIdDatoFacturaSeleccionado);
    });
  }

  private resolverRazonSocialSeleccionadaId(): number | undefined {
    if (this.nIdDatoFacturaSeleccionado && this.listaDatosFactura.some(item => item.nId === this.nIdDatoFacturaSeleccionado)) {
    return this.nIdDatoFacturaSeleccionado;
    }

    const razonSocialPredeterminada = this.listaDatosFactura.find(item => item.nPredeterminado === 1);
    if (razonSocialPredeterminada) {
    return razonSocialPredeterminada.nId;
    }

    return this.listaDatosFactura.length > 0 ? this.listaDatosFactura[0].nId : undefined;
  }

  obtenerFacruras(){

    this.mostrarSoloFacturadas = false;
    this.vistaFacturadas = false;
    this.vistaSeleccionada = 'pendientes';
    this.cargandoFacturadas = false;

    this.facturaService.obtenerVentaFactura().subscribe(resp =>{
      this.listaVentas=this.aplicarFiltroClienteContexto(resp || []);
      this.ventasSeleccionadas=[];
      this.intentarAutoAbrirVentaContextoCanonico();

      //console.log(this.listaVentas);
  });
  this.obtenerUsocfdi();

  }
  obtenerVentasFacturadas(){

    this.mostrarSoloFacturadas = true;
    this.vistaFacturadas = true;
    this.vistaSeleccionada = 'facturadas';
    this.cargandoFacturadas = true;

    this.facturaService.obtenerFacturas(this.construirFiltrosFacturadas()).subscribe(resp =>{
      this.listaVentas=this.aplicarFiltroClienteContexto(resp || []);
      this.ventasSeleccionadas=[];
      this.cargandoFacturadas = false;

      //console.log(this.listaVentas);
  }, () => {
      this.listaVentas = [];
      this.ventasSeleccionadas = [];
      this.cargandoFacturadas = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar el historial de facturadas.', life: 4000 });
  });

  }
  consultaCreditos(nIdDatoFactura?: number) {
    const razonSocialId = nIdDatoFactura || this.resolverRazonSocialSeleccionadaId();
    if (!razonSocialId) {
      this.creditosTotales = 0;
      this.hayTimbresDisponibles = false;
      return;
    }

    this.facturaService.consultaCreditos(razonSocialId).subscribe(resp => {
      this.creditosTotales = resp;
      this.hayTimbresDisponibles = this.creditosTotales > 0;
    });
  }

  onRazonSocialSeleccionada() {
    this.consultaCreditos(this.nIdDatoFacturaSeleccionado);
    if (this.mostrarDialogoSolicitudesPendientes) {
      this.consultarSolicitudesPendientes();
    }
  }

  cambiarVistaFacturacion(vista: string) {
    if (vista === 'facturadas') {
      if (!this.vistaFacturadas) {
        this.resetearFiltrosFacturadas();
      }
      this.obtenerVentasFacturadas();
      return;
    }

    this.obtenerFacruras();
  }

  onPeriodoFacturadasChange() {
    if (this.periodoFacturadas !== 'CUSTOM') {
      this.fechaInicioFacturadas = null;
      this.fechaFinFacturadas = null;
      if (this.vistaFacturadas) {
        this.obtenerVentasFacturadas();
      }
    }
  }

  onEstadoFacturadasChange() {
    if (this.vistaFacturadas) {
      this.obtenerVentasFacturadas();
    }
  }

  aplicarFiltrosFacturadas() {
    if (this.periodoFacturadas === 'CUSTOM' && (!this.fechaInicioFacturadas || !this.fechaFinFacturadas)) {
      this.messageService.add({ severity: 'warn', summary: 'ValidaciÃ³n', detail: 'Selecciona fecha inicial y final para el rango personalizado.', life: 3500 });
      return;
    }

    this.obtenerVentasFacturadas();
  }

  restablecerFiltrosFacturadas() {
    this.resetearFiltrosFacturadas();
    if (this.vistaFacturadas) {
      this.obtenerVentasFacturadas();
    }
  }

  private resetearFiltrosFacturadas() {
    this.periodoFacturadas = '60D';
    this.fechaInicioFacturadas = null;
    this.fechaFinFacturadas = null;
    this.estatusFacturadas = 'TODOS';
    this.busquedaFacturadas = '';
  }

  private construirFiltrosFacturadas(): { periodo?: string; fechaInicio?: string; fechaFin?: string; estatus?: string; buscar?: string; } {
    return {
      periodo: this.periodoFacturadas,
      fechaInicio: this.periodoFacturadas === 'CUSTOM' ? this.formatearFechaLocal(this.fechaInicioFacturadas) : undefined,
      fechaFin: this.periodoFacturadas === 'CUSTOM' ? this.formatearFechaLocal(this.fechaFinFacturadas) : undefined,
      estatus: this.estatusFacturadas,
      buscar: this.normalizarTextoFiltro(this.busquedaFacturadas)
    };
  }

  private formatearFechaLocal(fecha: Date | null): string | undefined {
    if (!fecha) {
      return undefined;
    }

    const year = fecha.getFullYear();
    const month = `${fecha.getMonth() + 1}`.padStart(2, '0');
    const day = `${fecha.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private normalizarTextoFiltro(valor: string): string | undefined {
    const normalizado = (valor || '').trim();
    return normalizado ? normalizado : undefined;
  }

  private aplicarFiltroClienteContexto(ventas: TvVentasFactura[]): TvVentasFactura[] {
    if (!this.clienteFiltroCanonicoId) {
      return ventas || [];
    }

    const ventasFiltradas = (ventas || []).filter(item => Number(item?.nIdCliente || 0) === Number(this.clienteFiltroCanonicoId));
    return this.ordenarVentasContextoCanonico(ventasFiltradas);
  }

  private ordenarVentasContextoCanonico(ventas: TvVentasFactura[]): TvVentasFactura[] {
    return [...(ventas || [])].sort((left, right) => {
      const prioridadLeft = this.requiereFacturacionDesdeAnticipo(left) ? 0 : 1;
      const prioridadRight = this.requiereFacturacionDesdeAnticipo(right) ? 0 : 1;
      if (prioridadLeft !== prioridadRight) {
        return prioridadLeft - prioridadRight;
      }
      return Number(right?.nId || 0) - Number(left?.nId || 0);
    });
  }



  openDialog(tvVentasFactura: TvVentasFactura) {
  this.modoFacturacionConsolidada = false;
  this.ventasConsolidadasActuales = [];
  if (tvVentasFactura?.idFactura && this.vistaFacturadas) {
    this.abrirDialogoComplementos(tvVentasFactura);
    return;
  }
  this.ventasService.obtenerCobroParcial(tvVentasFactura.nId).subscribe(data => {
    this.ListaTrVentaCobro = data || [];
    this.nuevaFormaPago = '';
    const resumenCobros = this.construirResumenCobros(this.ListaTrVentaCobro);
    const requierePpdCon99 = tvVentasFactura.nTipoPago === 1 || this.ListaTrVentaCobro.length > 1;
    const tieneAnticipoCanonico = this.requiereFacturacionDesdeAnticipo(tvVentasFactura);

    if (this.ListaTrVentaCobro.length > 1) {
      if (tvVentasFactura.nTipoPago === 1) {
        this.nuevaFormaPago = `PPD con forma 99 (por definir). Desglose de cobros: ${resumenCobros}`;
      } else {
        this.nuevaFormaPago = `PPD con forma 99 para facturar y REP inmediato. Desglose de cobros: ${resumenCobros}`;
      }
    } else if (tvVentasFactura.nTipoPago === 1 && tieneAnticipoCanonico) {
      this.nuevaFormaPago = `PPD con forma 99 (por definir). Anticipo aplicado desde pago global.`;
    } else if (tvVentasFactura.nTipoPago === 1) {
      this.nuevaFormaPago = `PPD con forma 99 (por definir). Cobro registrado: ${resumenCobros}`;
    } else {
      for (let index = 0; index < this.ListaTrVentaCobro.length; index++) {
        this.nuevaFormaPago = this.ListaTrVentaCobro[index].tcFormapago?.sDescripcion ?? '';
      }
    }

    if (tvVentasFactura.tcFormapago == null) {
      tvVentasFactura.tcFormapago = new TcFormaPago();
    }

    this.tvVentasFactura = tvVentasFactura;
    this.formFactura = true;
    this.idVenta = tvVentasFactura.nId;
    this.totalVenta = tvVentasFactura.nTotalVenta;
    this.cargarHistorialComplementos(tvVentasFactura.nId);

    const nIdDatoFactura = tvVentasFactura.tcCliente?.nIdDatoFactura;
    if (nIdDatoFactura) {
      this.nIdDatoFacturaSeleccionado = nIdDatoFactura;
      this.consultaCreditos(nIdDatoFactura);
    }

    if (requierePpdCon99) {
      this.tvVentasFactura.formaPago = 22;
      this.tvVentasFactura.tcFormapago.nId = 22;
      this.tvVentasFactura.tcFormapago.sClave = '99';
      this.tvVentasFactura.tcFormapago.sDescripcion = 'Por definir';
      this.tvVentasFactura.tcFormapago.nEstatus = 1;
    }
  });
}

  private construirResumenCobros(cobros: TrVentaCobro[]): string {
    if (!cobros || cobros.length === 0) {
      return 'Sin cobros registrados';
    }

    return cobros
      .map(cobro => {
        const descripcion = cobro?.tcFormapago?.sDescripcion ?? 'Sin definir';
        const monto = new Decimal(cobro?.nMonto ?? 0).toFixed(2);
        return `${descripcion}: $${monto}`;
      })
      .join(' / ');
  }

  openNew() { 

    this.clienteDialog = true;
    this.objCliente=this.tvVentasFactura.tcCliente; 
   
  }

  hideDialog(){
    this.formFactura=false;
    this.modoFacturacionConsolidada = false;
    this.ventasConsolidadasActuales = [];
  }

  generarFactura(){
    if (!this.hayTimbresDisponibles) {
        this.messageService.add({ severity: 'warn', summary: 'Sin CrÃ©ditos', detail: 'No hay timbres disponibles para facturar.', life: 4000 });
        return;
    }

    if (this.modoFacturacionConsolidada) {
      const idsVenta = (this.ventasConsolidadasActuales || []).map(item => item?.nId).filter(item => !!item);
      this.facturaService.facturarVentasConsolidadas(idsVenta, this.cfdiSeleccionado).subscribe(resp => {
        this.formFactura = false;
        this.ventasSeleccionadas = [];
        this.ventasConsolidadasActuales = [];
        this.modoFacturacionConsolidada = false;
        this.refrescarListadoActual();
        const resultado = resp as ResultadoFacturacionVentaDto;
        const detalle = resultado?.mensajeError
          ? `${resultado?.mensaje || 'Factura consolidada procesada'} ${resultado.mensajeError}`
          : (resultado?.mensaje || 'La factura consolidada se generÃ³ correctamente.');
        this.messageService.add({ severity: resultado?.success === false ? 'warn' : 'success', summary: 'Factura consolidada', detail: detalle, life: 6000 });
        if (resultado?.clasificacionFiscal) {
          this.messageService.add({ severity: 'info', summary: 'ClasificaciÃ³n fiscal', detail: `${resultado.clasificacionFiscal} | MÃ©todo: ${resultado.metodoPagoFiscal || 'N/D'} | Forma: ${resultado.formaPagoFiscal || 'N/D'}`, life: 7000 });
        }
      });
      return;
    }

    this.facturaService.facturarVenta(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      this.formFactura=false;
      this.refrescarListadoActual();
        const resultado = resp as ResultadoFacturacionVentaDto;
        const detalle = resultado?.mensajeError
          ? `${resultado?.mensaje || 'Factura procesada'} ${resultado.mensajeError}`
          : (resultado?.mensaje || 'La factura se generÃ³ correctamente.');
        this.messageService.add({ severity: resultado?.success === false ? 'warn' : 'success', summary: 'Factura generada', detail: detalle, life: 5000 });
        if (resultado?.clasificacionFiscal) {
          this.messageService.add({ severity: 'info', summary: 'ClasificaciÃ³n fiscal', detail: `${resultado.clasificacionFiscal} | MÃ©todo: ${resultado.metodoPagoFiscal || 'N/D'} | Forma: ${resultado.formaPagoFiscal || 'N/D'}`, life: 7000 });
        }
        if (resultado?.estadoComplemento === 'FACTURADA_CON_COMPLEMENTO_PAGO' && resultado?.uuidComplementoPago) {
          this.messageService.add({ severity: 'success', summary: 'Complemento de pago', detail: `Se generÃ³ el complemento de pago ${resultado.uuidComplementoPago}.`, life: 7000 });
        }
        if (resultado?.estadoComplemento === 'PENDIENTE_COMPLEMENTO_PAGO') {
          this.messageService.add({ severity: 'warn', summary: 'Complemento pendiente', detail: 'La factura se generÃ³, pero el complemento de pago quedÃ³ pendiente de timbrar.', life: 7000 });
        }
        if (resultado && resultado.avisoCorreo) {
          this.messageService.add({ severity: 'warn', summary: 'Correo no enviado', detail: resp.avisoCorreo, life: 6000 });
        }
    });

  }

  abrirDialogoFacturacionConsolidada() {
    if (!this.ventasSeleccionadas || this.ventasSeleccionadas.length < 2) {
      this.messageService.add({ severity: 'warn', summary: 'SelecciÃ³n insuficiente', detail: 'Selecciona al menos dos ventas para una factura consolidada.', life: 4000 });
      return;
    }

    const ventas = this.ventasSeleccionadas.filter(item => !!item);
    const clienteBase = ventas[0]?.nIdCliente;
    const datoFacturaBase = ventas[0]?.tcCliente?.nIdDatoFactura;
    const hayClienteDistinto = ventas.some(item => item?.nIdCliente !== clienteBase);
    const hayDatoFacturaDistinto = ventas.some(item => item?.tcCliente?.nIdDatoFactura !== datoFacturaBase);
    const hayNoValidadas = ventas.some(item => item?.tcCliente?.nDatosValidados !== true);
    const hayFacturadas = ventas.some(item => item?.idFactura && item.idFactura !== 0);
    const tipoVentaBase = ventas[0]?.nTipoPago;
    const hayTipoVentaDistinto = ventas.some(item => item?.nTipoPago !== tipoVentaBase);

    if (hayClienteDistinto) {
      this.messageService.add({ severity: 'warn', summary: 'Clientes distintos', detail: 'La factura consolidada solo puede agrupar ventas del mismo cliente.', life: 4500 });
      return;
    }

    if (hayTipoVentaDistinto) {
      this.messageService.add({ severity: 'warn', summary: 'Tipos de venta distintos', detail: 'La factura consolidada solo admite ventas del mismo tipo (ej. solo Contado o solo CrÃ©dito). No mezclar.', life: 5500 });
      return;
    }

    if (hayDatoFacturaDistinto) {
      this.messageService.add({ severity: 'warn', summary: 'RazÃ³n social distinta', detail: 'La factura consolidada requiere la misma razÃ³n social emisora en todas las ventas.', life: 4500 });
      return;
    }

    if (hayNoValidadas) {
      this.messageService.add({ severity: 'warn', summary: 'Datos fiscales pendientes', detail: 'Todas las ventas seleccionadas deben tener datos fiscales validados.', life: 4500 });
      return;
    }

    if (hayFacturadas) {
      this.messageService.add({ severity: 'warn', summary: 'Venta ya facturada', detail: 'La selecciÃ³n incluye ventas que ya tienen CFDI.', life: 4500 });
      return;
    }

    this.modoFacturacionConsolidada = true;
    this.ventasConsolidadasActuales = [...ventas];
    this.tvVentasFactura = ventas[0];
    this.idVenta = ventas[0].nId;
    this.totalVenta = ventas.reduce((total, item) => total + Number(item?.nTotalVenta || 0), 0);
    this.cfdiSeleccionado = null;
    this.formFactura = true;

    const nIdDatoFactura = ventas[0]?.tcCliente?.nIdDatoFactura;
    if (nIdDatoFactura) {
      this.nIdDatoFacturaSeleccionado = nIdDatoFactura;
      this.consultaCreditos(nIdDatoFactura);
    }
  }

  puedeSeleccionarVentaConsolidada(venta: TvVentasFactura): boolean {
    return !!venta && !venta?.idFactura && venta?.tcCliente?.nDatosValidados === true;
  }

  limpiarFiltroClienteContexto() {
    this.router.navigate(['/caja/facturacion']);
  }

  private intentarAutoAbrirVentaContextoCanonico() {
    if (this.autoAperturaContextoCanonicoRealizada || !this.focoAnticipoCanonico || this.vistaFacturadas || this.formFactura) {
      return;
    }

    const ventasPriorizadas = (this.listaVentas || []).filter(item => this.requiereFacturacionDesdeAnticipo(item));
    if (ventasPriorizadas.length !== 1) {
      this.autoAperturaContextoCanonicoRealizada = true;
      return;
    }

    this.autoAperturaContextoCanonicoRealizada = true;
    this.openDialog(ventasPriorizadas[0]);
  }

  get totalSeleccionadasConsolidacion(): number {
    return (this.ventasSeleccionadas || []).length;
  }

  get resumenVentasConsolidadas(): string {
    return (this.ventasConsolidadasActuales || []).map(item => `#${item.nId}`).join(', ');
  }

  generarComplemento(){
    if (!this.hayTimbresDisponibles) {
        this.messageService.add({ severity: 'warn', summary: 'Sin CrÃ©ditos', detail: 'No hay timbres disponibles para generar el complemento.', life: 4000 });
        return;
    }

    if (this.esFacturaConsolidada(this.tvVentasFactura)) {
      this.messageService.add({ severity: 'warn', summary: 'REP desde pago global', detail: 'La factura es consolidada. El REP debe generarse desde pagos canÃ³nicos/globales, no desde una venta individual.', life: 5000 });
      return;
    }

    this.facturaService.facturarComplemento(this.idVenta,this.usoCfdiComplemento).subscribe(resp =>{
      this.formFactura=false;
      this.refrescarListadoActual();
      const resultado = resp as ResultadoFacturacionVentaDto;
      const detalle = resultado?.mensajeError
        ? `${resultado?.mensaje || 'Complemento procesado'} ${resultado.mensajeError}`
        : (resultado?.mensaje || 'El complemento se generÃ³ correctamente.');
      this.messageService.add({ severity: resultado?.success === false ? 'warn' : 'success', summary: 'Complemento generado', detail: detalle, life: 5000 });
    });

  }

  reintentarComplementoHistorial(complemento: ComplementoPagoHistorialDto) {
    if (!complemento?.nId) {
      return;
    }

    if (!this.hayTimbresDisponibles) {
      this.messageService.add({ severity: 'warn', summary: 'Sin CrÃ©ditos', detail: 'No hay timbres disponibles para reintentar el complemento.', life: 4000 });
      return;
    }

    this.facturaService.reintentarComplemento(complemento.nId).subscribe(resp => {
      const resultado = resp as ResultadoFacturacionVentaDto;
      const detalle = resultado?.mensajeError
        ? `${resultado?.mensaje || 'Reintento procesado'} ${resultado.mensajeError}`
        : (resultado?.mensaje || 'El complemento se reintentÃ³ correctamente.');
      this.messageService.add({ severity: resultado?.success === false ? 'warn' : 'success', summary: 'Reintento REP', detail: detalle, life: 5000 });
      if (this.idVenta) {
        this.cargarHistorialComplementos(this.idVenta);
      }
      this.refrescarListadoActual();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible reintentar el complemento.', life: 3500 });
    });
  }

  reintentarComplemento(venta: TvVentasFactura) {
    if (this.esFacturaConsolidada(venta)) {
      this.messageService.add({ severity: 'warn', summary: 'REP desde pago global', detail: 'La factura es consolidada. El REP debe generarse desde pagos canÃ³nicos/globales, no desde una venta individual.', life: 5000 });
      return;
    }

    this.tvVentasFactura = venta;
    this.idVenta = venta.nId;
    this.cargarHistorialComplementos(venta.nId);
    this.generarComplemento();
  }

  abrirDialogoComplementos(venta: TvVentasFactura) {
    this.tvVentasFactura = venta;
    this.idVenta = venta.nId;
    this.cargarHistorialComplementos(venta.nId);
    this.mostrarDialogoComplementos = true;
  }

  cerrarDialogoComplementos() {
    this.mostrarDialogoComplementos = false;
  }

  abrirDialogoAccionesVenta(venta: TvVentasFactura) {
    this.tvVentasFactura = venta;
    this.idVenta = venta.nId;
    this.mostrarDialogoAccionesVenta = true;
  }

  cerrarDialogoAccionesVenta() {
    this.mostrarDialogoAccionesVenta = false;
  }

  abrirDialogoFacturaConsolidada(venta: TvVentasFactura) {
    if (!this.esFacturaConsolidada(venta)) {
      return;
    }

    this.tvVentasFactura = venta;
    this.idVenta = venta.nId;
    this.ventasFacturaConsolidadaActual = this.obtenerVentasRelacionadasFactura(venta)
      .sort((left, right) => Number(left?.nId || 0) - Number(right?.nId || 0));
    this.mostrarDialogoFacturaConsolidada = true;
  }

  cerrarDialogoFacturaConsolidada() {
    this.mostrarDialogoFacturaConsolidada = false;
    this.ventasFacturaConsolidadaActual = [];
  }

  abrirAccionesDesdeFacturaConsolidada(venta: TvVentasFactura) {
    this.cerrarDialogoFacturaConsolidada();
    this.abrirDialogoAccionesVenta(venta);
  }

  cargarHistorialComplementos(nIdVenta:number) {
    this.cargandoComplementos = true;
    this.historialComplementos = [];
    this.filtroEstadoHistorialComplemento = 'TODOS';
    this.filtroParcialidadHistorialComplemento = undefined;
    this.facturaService.consultarComplementos(nIdVenta).subscribe(resp => {
      this.historialComplementos = resp || [];
      this.cargandoComplementos = false;
    }, () => {
      this.cargandoComplementos = false;
      this.historialComplementos = [];
    });
  }

  abrirDialogoCancelacion(venta: TvVentasFactura) {
    this.ventaCancelar = venta;
    this.motivoCancelacion = '02';
    this.folioFiscalSustitucion = '';
    this.mostrarDialogoCancelacion = true;
  }

  cerrarDialogoCancelacion() {
    this.mostrarDialogoCancelacion = false;
    this.ventaCancelar = undefined;
    this.motivoCancelacion = '';
    this.folioFiscalSustitucion = '';
  }

  confirmarCancelacion() {
    if (!this.ventaCancelar) {
      return;
    }

    if (!this.motivoCancelacion) {
      this.messageService.add({ severity: 'warn', summary: 'ValidaciÃ³n', detail: 'Selecciona un motivo de cancelaciÃ³n.', life: 3000 });
      return;
    }

    if (this.motivoCancelacion === '01' && !this.folioFiscalSustitucion) {
      this.messageService.add({ severity: 'warn', summary: 'ValidaciÃ³n', detail: 'El folio fiscal de sustituciÃ³n es obligatorio para el motivo 01.', life: 4000 });
      return;
    }

    const payload = new CancelacionFacturaDto();
    payload.nIdVenta = this.ventaCancelar.nId;
    payload.motivo = this.motivoCancelacion;
    payload.folioFiscalSustitucion = this.folioFiscalSustitucion || null;

    this.facturaService.cancelarFactura(payload).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Factura cancelada', detail: 'La solicitud de cancelaciÃ³n se procesÃ³ correctamente.', life: 4000 });
      this.cerrarDialogoCancelacion();
      this.obtenerVentasFacturadas();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible cancelar la factura.', life: 4000 });
    });
  }

  abrirDialogoEstatusSat(venta: TvVentasFactura) {
    this.estatusSat = new StatusCfdiResponse();
    this.tvVentasFactura = venta;
    this.facturaService.consultarEstatusSat(venta.nId).subscribe(resp => {
      this.estatusSat = resp || new StatusCfdiResponse();
      this.mostrarDialogoEstatusSat = true;
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar el estatus SAT.', life: 4000 });
    });
  }

  abrirDialogoRelacionados(venta: TvVentasFactura) {
    this.cfdiRelacionados = new CfdiRelacionadosResponse();
    this.tvVentasFactura = venta;
    this.facturaService.consultarCfdiRelacionados(venta.nId).subscribe(resp => {
      this.cfdiRelacionados = resp || new CfdiRelacionadosResponse();
      if (!this.cfdiRelacionados.relacionados) {
        this.cfdiRelacionados.relacionados = [];
      }
      this.mostrarDialogoRelacionados = true;
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar los CFDI relacionados.', life: 4000 });
    });
  }

  abrirDialogoSolicitudesPendientes() {
    this.listaSolicitudesPendientes = [];
    this.mostrarDialogoSolicitudesPendientes = true;
    if (this.nIdDatoFacturaSeleccionado) {
      this.consultarSolicitudesPendientes();
    }
  }

  consultarSolicitudesPendientes() {
    if (!this.nIdDatoFacturaSeleccionado) {
      this.messageService.add({ severity: 'warn', summary: 'ValidaciÃ³n', detail: 'Selecciona una razÃ³n social emisora.', life: 3000 });
      return;
    }
    this.cargandoSolicitudes = true;
    this.facturaService.consultarSolicitudesPendientes(this.nIdDatoFacturaSeleccionado).subscribe(resp => {
      this.listaSolicitudesPendientes = resp || [];
      this.cargandoSolicitudes = false;
    }, () => {
      this.cargandoSolicitudes = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible consultar las solicitudes pendientes.', life: 4000 });
    });
  }

  procesarSolicitudPendiente(solicitud: SolicitudCancelacionDto, aceptar: boolean) {
    if (!this.nIdDatoFacturaSeleccionado || !solicitud?.uuid) {
      return;
    }
    const payload = new SolicitudCancelacionAccionDto();
    payload.nIdDatoFactura = this.nIdDatoFacturaSeleccionado;
    payload.uuid = solicitud.uuid;
    const request = aceptar ? this.facturaService.aceptarSolicitudPendiente(payload) : this.facturaService.rechazarSolicitudPendiente(payload);
    request.subscribe(resp => {
      const mensaje = resp?.mensajeError ? resp.mensajeError : aceptar ? 'La solicitud se aceptÃ³ correctamente.' : 'La solicitud se rechazÃ³ correctamente.';
      this.messageService.add({ severity: resp?.success === false ? 'warn' : 'success', summary: aceptar ? 'Solicitud aceptada' : 'Solicitud rechazada', detail: mensaje, life: 4000 });
      this.consultarSolicitudesPendientes();
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: aceptar ? 'No fue posible aceptar la solicitud.' : 'No fue posible rechazar la solicitud.', life: 4000 });
    });
  }

  obtenerNombreRazonSocialSeleccionada() {
    const razonSocial = this.listaDatosFactura.find(item => item.nId === this.nIdDatoFacturaSeleccionado);
    return razonSocial ? razonSocial.sRazonSocial : '';
  }

  esFacturaCancelada(venta: TvVentasFactura): boolean {
    const estatus = (venta?.sEstadoFacturacion || '').toUpperCase();
    return estatus.includes('CANCEL');
  }

  mostrarBotonComplemento(venta: TvVentasFactura): boolean {
    if (!venta || venta.idFactura == null || venta.idFactura === 0 || this.esFacturaCancelada(venta)) {
      return false;
    }

    if (this.esFacturaConsolidada(venta)) {
      return false;
    }

    const clasificacion = (venta.sClasificacionFiscal || '').toUpperCase();
    const estadoComplemento = (venta.sEstadoComplemento || '').toUpperCase();

    if (clasificacion === 'PPD_PAGO_MIXTO_COMPLEMENTO_INMEDIATO') {
      return !estadoComplemento || estadoComplemento === 'PENDIENTE_COMPLEMENTO_PAGO';
    }

    return false;
  }

  obtenerDescripcionTipoVenta(venta: TvVentasFactura): string {
    return venta?.nTipoPago === 1 ? 'CrÃ©dito' : 'Contado';
  }

  tieneAnticipoCanonico(venta: TvVentasFactura): boolean {
    return !!venta?.nIdPagoClienteCanonico;
  }

  obtenerDescripcionAnticipoCanonico(venta: TvVentasFactura): string {
    if (!this.tieneAnticipoCanonico(venta)) {
      return '';
    }

    const pagoId = venta?.nIdPagoClienteCanonico ? `#${venta.nIdPagoClienteCanonico}` : 'sin identificador';
    return `Pago global ${pagoId} aplicado como anticipo. Al facturar esta venta, la aplicaciÃ³n canÃ³nica quedarÃ¡ ligada al CFDI para continuar el REP desde el pago global.`;
  }

  requiereFacturacionDesdeAnticipo(venta: TvVentasFactura): boolean {
    return this.tieneAnticipoCanonico(venta) && (venta?.sEstadoRepCanonico || '').toUpperCase() === 'PENDIENTE_FACTURACION';
  }

  obtenerDescripcionClasificacion(venta: TvVentasFactura): string {
    const clasificacion = (venta?.sClasificacionFiscal || '').toUpperCase();

    if (clasificacion === 'PUE_UNA_FORMA') {
      return 'Contado una sola forma';
    }

    if (clasificacion === 'PPD_PAGO_MIXTO_COMPLEMENTO_INMEDIATO') {
      return 'Contado mixto con REP';
    }

    if (clasificacion === 'PPD_CREDITO_SIN_COMPLEMENTO') {
      return 'CrÃ©dito PPD';
    }

    return 'Pendiente';
  }

  obtenerEstadoFacturaVisible(venta: TvVentasFactura): string {
    if (!venta?.idFactura || venta.idFactura === 0) {
      return 'No facturada';
    }

    if (this.esFacturaCancelada(venta)) {
      return 'Cancelada';
    }

    return 'Facturada';
  }

  obtenerClaseEstadoFacturaVisible(venta: TvVentasFactura): string {
    if (!venta?.idFactura || venta.idFactura === 0) {
      return 'facturacion-status-badge-pending';
    }

    if (this.esFacturaCancelada(venta)) {
      return 'facturacion-status-badge-cancelled';
    }

    return 'facturacion-status-badge-confirmed';
  }

  obtenerPistaComplemento(venta: TvVentasFactura): string {
    if (!venta?.idFactura || venta.idFactura === 0 || this.esFacturaCancelada(venta)) {
      if (this.requiereFacturacionDesdeAnticipo(venta)) {
        return 'Anticipo aplicado';
      }
      return '';
    }

    if (this.esFacturaConsolidada(venta)) {
      return 'REP por pago canÃ³nico/global';
    }

    if (this.tieneComplementosTimbrados(venta)) {
      return 'Con complemento de pago';
    }

    if (this.mostrarBotonComplemento(venta)) {
      return 'Complemento disponible';
    }

    return '';
  }

  obtenerDescripcionEstadoComplemento(venta: TvVentasFactura): string {
    if (this.esFacturaConsolidada(venta)) {
      return 'Gestionar desde pago global';
    }

    const estado = (venta?.sEstadoComplemento || '').toUpperCase();

    if (!estado || estado === 'NO_REQUIERE_COMPLEMENTO') {
      return 'No requiere';
    }

    if (estado === 'FACTURADA_CON_COMPLEMENTO_PAGO') {
      return 'Timbrado';
    }

    if (estado === 'PENDIENTE_COMPLEMENTO_PAGO') {
      return 'Pendiente';
    }

    return venta?.sEstadoComplemento || 'Pendiente';
  }

  obtenerDescripcionEstadoHistorial(complemento: ComplementoPagoHistorialDto): string {
    const estado = (complemento?.estado || '').toUpperCase();
    if (this.esComplementoReemplazado(complemento)) {
      return 'Fallido reemplazado';
    }
    if (!estado && complemento?.estatus === 1) {
      return 'Timbrado';
    }
    if (!estado && complemento?.estatus === 0) {
      return 'Fallido';
    }
    if (estado.includes('TIMBR')) {
      return 'Timbrado';
    }
    if (complemento?.estatus === 0) {
      return 'Fallido';
    }
    return complemento?.estado || 'Pendiente';
  }

  esComplementoFallido(complemento: ComplementoPagoHistorialDto): boolean {
    return complemento?.estatus === 0;
  }

  esComplementoReemplazado(complemento: ComplementoPagoHistorialDto): boolean {
    if (!this.esComplementoFallido(complemento)) {
      return false;
    }

    return this.historialComplementos.some(item =>
      item?.nId !== complemento?.nId &&
      item?.estatus === 1 &&
      item?.origenPago === complemento?.origenPago &&
      item?.nIdPagoOrigen === complemento?.nIdPagoOrigen
    );
  }

  puedeReintentarComplemento(complemento: ComplementoPagoHistorialDto): boolean {
    if (this.esComplementoPagoGlobal(complemento)) {
      return false;
    }
    return this.esComplementoFallido(complemento) && !this.esComplementoReemplazado(complemento);
  }

  esFacturaConsolidada(venta: TvVentasFactura): boolean {
    if (!venta?.idFactura || !this.listaVentas || this.listaVentas.length === 0) {
      return false;
    }

    return this.listaVentas.filter(item => item?.idFactura === venta.idFactura).length > 1;
  }

  puedeDescargarComplementoXml(complemento: ComplementoPagoHistorialDto): boolean {
    return complemento?.estatus === 1;
  }

  puedeDescargarComplementoPdf(complemento: ComplementoPagoHistorialDto): boolean {
    return complemento?.estatus === 1;
  }

  tieneComplementosTimbrados(venta: TvVentasFactura): boolean {
    return (venta?.sEstadoComplemento || '').toUpperCase() === 'FACTURADA_CON_COMPLEMENTO_PAGO';
  }

  obtenerConteoComplementosTimbrados(venta: TvVentasFactura): number {
    if (!venta || !this.tvVentasFactura || this.tvVentasFactura.nId !== venta.nId) {
      return 0;
    }
    return (this.historialComplementos || []).filter(item => item?.estatus === 1).length;
  }

  obtenerEtiquetaAccionPrincipal(venta: TvVentasFactura): string {
    if (venta?.idFactura == null || venta.idFactura === 0) {
      if (this.requiereFacturacionDesdeAnticipo(venta)) {
        return 'Facturar anticipo';
      }
      return 'Facturar';
    }
    if (this.esFacturaCancelada(venta)) {
      return 'Acuse';
    }
    if (this.tieneComplementosTimbrados(venta)) {
      return 'Complementos';
    }
    if (this.mostrarBotonComplemento(venta)) {
      return 'REP';
    }
    return 'Documentos';
  }

  obtenerIconoAccionPrincipal(venta: TvVentasFactura): string {
    if (venta?.idFactura == null || venta.idFactura === 0) {
      if (this.requiereFacturacionDesdeAnticipo(venta)) {
        return 'pi pi-credit-card';
      }
      return 'pi pi-file';
    }
    if (this.esFacturaCancelada(venta)) {
      return 'pi pi-download';
    }
    if (this.tieneComplementosTimbrados(venta)) {
      return 'pi pi-images';
    }
    if (this.mostrarBotonComplemento(venta)) {
      return 'pi pi-refresh';
    }
    return 'pi pi-folder-open';
  }

  ejecutarAccionPrincipal(venta: TvVentasFactura) {
    if (!venta) {
      return;
    }

    if (venta.tcCliente?.nDatosValidados === true && (!venta.idFactura || venta.idFactura === 0)) {
      this.openDialog(venta);
      return;
    }

    if (venta.idFactura && this.esFacturaCancelada(venta)) {
      this.descargarAcuseCancelacion(venta.nId);
      return;
    }

    if (venta.idFactura && this.tieneComplementosTimbrados(venta)) {
      this.abrirDialogoComplementos(venta);
      return;
    }

    if (venta.idFactura && this.mostrarBotonComplemento(venta)) {
      this.reintentarComplemento(venta);
      return;
    }

    this.abrirDialogoAccionesVenta(venta);
  }

  obtenerSiguientePaso(venta: TvVentasFactura): string {
    if (!venta) {
      return 'Revisar venta';
    }

    if (venta.tcCliente?.nDatosValidados !== true && (!venta.idFactura || venta.idFactura === 0)) {
      return 'Validar datos fiscales';
    }

    if (this.requiereFacturacionDesdeAnticipo(venta)) {
      return 'Facturar con anticipo';
    }

    if (!venta.idFactura || venta.idFactura === 0) {
      return 'Timbrar CFDI';
    }

    if (this.esFacturaCancelada(venta)) {
      return 'Descargar acuse';
    }

    if (this.esFacturaConsolidada(venta)) {
      return this.tieneComplementosTimbrados(venta) ? 'Revisar REP global' : 'Gestionar REP global';
    }

    if (this.mostrarBotonComplemento(venta)) {
      return 'Generar REP';
    }

    if (this.tieneComplementosTimbrados(venta)) {
      return 'Revisar REP';
    }

    return 'Consultar documentos';
  }

  obtenerClaseSiguientePaso(venta: TvVentasFactura): string {
    if (!venta) {
      return 'facturacion-next-step-neutral';
    }

    if (venta.tcCliente?.nDatosValidados !== true && (!venta.idFactura || venta.idFactura === 0)) {
      return 'facturacion-next-step-warning';
    }

    if (this.requiereFacturacionDesdeAnticipo(venta)) {
      return 'facturacion-next-step-warning';
    }

    if (this.esFacturaConsolidada(venta)) {
      return 'facturacion-next-step-warning';
    }

    if (!venta.idFactura || venta.idFactura === 0 || this.mostrarBotonComplemento(venta)) {
      return 'facturacion-next-step-alert';
    }

    if (this.esFacturaCancelada(venta)) {
      return 'facturacion-next-step-neutral';
    }

    return 'facturacion-next-step-success';
  }

  obtenerAccionesVenta(venta: TvVentasFactura): MenuItem[] {
    const acciones: MenuItem[] = [];

    if (venta?.tcCliente?.nDatosValidados === true && (!venta.idFactura || venta.idFactura === 0)) {
      acciones.push({
        label: 'Cargar factura manual',
        icon: 'pi pi-paperclip',
        command: () => this.mostrarformularioFactura(venta.nId)
      });
    }

    if (venta?.idFactura && !this.esFacturaCancelada(venta)) {
      acciones.push({
        label: 'Descargar PDF factura',
        icon: 'pi pi-file-pdf',
        command: () => this.descargarFactura(venta.nId)
      });
      acciones.push({
        label: 'Descargar XML factura',
        icon: 'pi pi-book',
        command: () => this.descargarXML(venta.nId)
      });
    }

    if (venta?.idFactura && this.esFacturaConsolidada(venta)) {
      acciones.push({
        label: 'Ver ventas del CFDI consolidado',
        icon: 'pi pi-clone',
        command: () => this.abrirDialogoFacturaConsolidada(venta)
      });
    }

    if (venta?.idFactura && this.tieneComplementosTimbrados(venta)) {
      acciones.push({
        label: 'Abrir complementos de pago',
        icon: 'pi pi-images',
        command: () => this.abrirDialogoComplementos(venta)
      });
    }

    if (venta?.idFactura && this.mostrarBotonComplemento(venta)) {
      acciones.push({
        label: 'Generar o reintentar REP',
        icon: 'pi pi-refresh',
        command: () => this.reintentarComplemento(venta)
      });
    }

    if (venta?.idFactura && !this.esFacturaCancelada(venta)) {
      acciones.push({
        label: 'Cancelar CFDI',
        icon: 'pi pi-times',
        command: () => this.abrirDialogoCancelacion(venta)
      });
    }

    if (venta?.idFactura && this.esFacturaCancelada(venta)) {
      acciones.push({
        label: 'Descargar acuse de cancelaciÃ³n',
        icon: 'pi pi-download',
        command: () => this.descargarAcuseCancelacion(venta.nId)
      });
    }

    if (venta?.idFactura) {
      acciones.push({
        label: 'Consultar estatus SAT',
        icon: 'pi pi-search',
        command: () => this.abrirDialogoEstatusSat(venta)
      });
      acciones.push({
        label: 'Consultar CFDI relacionados',
        icon: 'pi pi-sitemap',
        command: () => this.abrirDialogoRelacionados(venta)
      });
    }

    return acciones;
  }

  get totalVentasListado(): number {
    return (this.listaVentas || []).length;
  }

  get totalVentasConFactura(): number {
    return (this.listaVentas || []).filter(item => item?.idFactura != null && item.idFactura !== 0).length;
  }

  get totalVentasConAnticipoCanonico(): number {
    return (this.listaVentas || []).filter(item => this.requiereFacturacionDesdeAnticipo(item)).length;
  }

  get mostrarResumenAnticipoCanonico(): boolean {
    return !!this.clienteFiltroCanonicoId && !this.vistaFacturadas && this.totalVentasConAnticipoCanonico > 0;
  }

  obtenerClaseFilaVenta(venta: TvVentasFactura): string {
    if (this.requiereFacturacionDesdeAnticipo(venta)) {
      return 'facturacion-row-canonico';
    }
    return '';
  }

  get totalRepTimbrados(): number {
    return (this.listaVentas || []).filter(item => (item?.sEstadoComplemento || '').toUpperCase() === 'FACTURADA_CON_COMPLEMENTO_PAGO').length;
  }

  get totalRepPendientes(): number {
    return (this.listaVentas || []).filter(item => (item?.sEstadoComplemento || '').toUpperCase() === 'PENDIENTE_COMPLEMENTO_PAGO').length;
  }

  get totalFacturasCanceladas(): number {
    return (this.listaVentas || []).filter(item => this.esFacturaCancelada(item)).length;
  }

  get totalCfdiConsolidados(): number {
    const ids = new Set<number>();
    (this.listaVentas || []).forEach(item => {
      if (this.esFacturaConsolidada(item) && item?.idFactura) {
        ids.add(item.idFactura);
      }
    });
    return ids.size;
  }

  get totalVentasEnCfdiConsolidado(): number {
    return (this.listaVentas || []).filter(item => this.esFacturaConsolidada(item)).length;
  }

  obtenerEtiquetaFacturaConsolidada(venta: TvVentasFactura): string {
    const totalVentas = this.obtenerTotalVentasMismaFactura(venta);
    if (!this.esFacturaConsolidada(venta) || !venta?.idFactura) {
      return '';
    }
    return `CFDI consolidado #${venta.idFactura} | ${totalVentas} ventas`;
  }

  obtenerTotalVentasMismaFactura(venta: TvVentasFactura): number {
    if (!venta?.idFactura || !this.listaVentas || this.listaVentas.length === 0) {
      return 0;
    }

    return this.listaVentas.filter(item => item?.idFactura === venta.idFactura).length;
  }

  obtenerVentasRelacionadasFactura(venta: TvVentasFactura): TvVentasFactura[] {
    if (!venta?.idFactura || !this.listaVentas || this.listaVentas.length === 0) {
      return [];
    }

    return this.listaVentas.filter(item => item?.idFactura === venta.idFactura);
  }

  get totalMontoFacturaConsolidadaActual(): number {
    return (this.ventasFacturaConsolidadaActual || []).reduce((total, item) => total + Number(item?.nTotalVenta || 0), 0);
  }

  get historialComplementosFiltrados(): ComplementoPagoHistorialDto[] {
    let historial = this.historialComplementos || [];

    if (this.filtroParcialidadHistorialComplemento != null) {
      historial = historial.filter(item => item?.parcialidad === this.filtroParcialidadHistorialComplemento);
    }

    if (this.filtroEstadoHistorialComplemento === 'TIMBRADOS') {
      return historial.filter(item => item?.estatus === 1);
    }

    if (this.filtroEstadoHistorialComplemento === 'FALLIDOS') {
      return historial.filter(item => this.esComplementoFallido(item));
    }

    if (this.filtroEstadoHistorialComplemento === 'REEMPLAZADOS') {
      return historial.filter(item => this.esComplementoReemplazado(item));
    }

    return historial;
  }

  get complementosPagoExitosos(): ComplementoPagoHistorialDto[] {
    let historial = this.historialComplementos || [];

    if (this.filtroParcialidadHistorialComplemento != null) {
      historial = historial.filter(item => item?.parcialidad === this.filtroParcialidadHistorialComplemento);
    }

    return historial.filter(item => item?.estatus === 1);
  }

  get complementosPagoFallidosLog(): ComplementoPagoHistorialDto[] {
    let historial = this.historialComplementos || [];

    if (this.filtroParcialidadHistorialComplemento != null) {
      historial = historial.filter(item => item?.parcialidad === this.filtroParcialidadHistorialComplemento);
    }

    return historial.filter(item => this.esComplementoFallido(item));
  }

  descargarZipComplementos(nIdVenta:number) {
    this.facturaService.descargarDocumento(nIdVenta, TipoDoc.ZIP_COMPLEMENTOS_PAGO).subscribe(resp => {
      const file = new Blob([resp], { type: 'application/zip' });
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'complementos_pago_' + nIdVenta + '.zip';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'ZIP de complementos descargado.', life: 3000 });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Sin archivos', detail: 'No se encontraron archivos de complementos para esta factura.', life: 3500 });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible descargar el ZIP de complementos.', life: 3500 });
    });
  }

  obtenerDescripcionOrigenPago(origenPago?: string): string {
    if ((origenPago || '').toUpperCase() === 'TR_VENTA_COBRO') {
      return 'Cobro de venta';
    }

    if ((origenPago || '').toUpperCase() === 'TW_ABONO') {
      return 'Abono de crÃ©dito';
    }

    if ((origenPago || '').toUpperCase() === 'TW_PAGO_CLIENTE_APLICACION') {
      return 'Pago global aplicado';
    }

    return origenPago || 'N/D';
  }

  esComplementoPagoGlobal(complemento: ComplementoPagoHistorialDto): boolean {
    return (complemento?.origenPago || '').toUpperCase() === 'TW_PAGO_CLIENTE_APLICACION';
  }

  descargarComplementoPdf(complemento: ComplementoPagoHistorialDto) {
    if (!complemento?.nId || !this.puedeDescargarComplementoPdf(complemento)) {
      return;
    }

    this.facturaService.descargarDocumentoComplemento(complemento.nId, TipoDoc.PDF_COMPLEMENTO_PAGO).subscribe(resp => {
      const file = new Blob([resp], { type: 'application/pdf' });
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'complemento_pago_' + (complemento.parcialidad || complemento.nId) + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'PDF del complemento descargado.', life: 3000 });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Sin PDF', detail: 'No se encontrÃ³ PDF para este complemento.', life: 3500 });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible descargar el PDF del complemento.', life: 3500 });
    });
  }

  verComplementoPdf(complemento: ComplementoPagoHistorialDto) {
    if (!complemento?.nId || !this.puedeDescargarComplementoPdf(complemento)) {
      return;
    }

    this.facturaService.descargarDocumentoComplemento(complemento.nId, TipoDoc.PDF_COMPLEMENTO_PAGO).subscribe(resp => {
      const file = new Blob([resp], { type: 'application/pdf' });
      if (file != null && file.size > 0) {
        if (this.urlVistaPreviaComplemento) {
          window.URL.revokeObjectURL(this.urlVistaPreviaComplemento);
        }
        this.urlVistaPreviaComplemento = window.URL.createObjectURL(file);
        this.tituloVistaPreviaComplemento = 'Complemento de pago ' + (complemento.parcialidad || complemento.nId);
        this.mostrarDialogoVistaPreviaComplemento = true;
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Sin PDF', detail: 'No se encontrÃ³ PDF para este complemento.', life: 3500 });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible abrir el PDF del complemento.', life: 3500 });
    });
  }

  cerrarVistaPreviaComplemento() {
    this.mostrarDialogoVistaPreviaComplemento = false;
    this.tituloVistaPreviaComplemento = '';
    if (this.urlVistaPreviaComplemento) {
      window.URL.revokeObjectURL(this.urlVistaPreviaComplemento);
    }
    this.urlVistaPreviaComplemento = null;
  }

  descargarComplementoXml(complemento: ComplementoPagoHistorialDto) {
    if (!complemento?.nId || !this.puedeDescargarComplementoXml(complemento)) {
      return;
    }

    this.facturaService.descargarDocumentoComplemento(complemento.nId, TipoDoc.XML_COMPLEMENTO_PAGO).subscribe(resp => {
      const file = new Blob([resp], { type: 'application/xml' });
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'complemento_pago_' + (complemento.parcialidad || complemento.nId) + '.xml';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'XML del complemento descargado.', life: 3000 });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Sin XML', detail: 'No se encontrÃ³ XML para este complemento.', life: 3500 });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible descargar el XML del complemento.', life: 3500 });
    });
  }

  private refrescarListadoActual() {
    if (this.mostrarSoloFacturadas) {
      this.obtenerVentasFacturadas();
      return;
    }

    this.obtenerFacruras();
  }


  descargarFactura(nIdVenta:number){

    //console.log();

    this.facturaService.descargarDocumento(nIdVenta, TipoDoc.PDF_FACTURA ).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
    //  console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'factura_' + nIdVenta + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'comprobante de factura Generado', life: 3000 });
        //una vez generado el reporte limpia el formulario para una nueva venta o cotizaciÃ³n 

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de factura', life: 3000 });
      }

    });

  }

  descargarXML(nIdVenta:number){

  

    this.facturaService.descargarDocumento(nIdVenta, TipoDoc.XML_FACTURA ).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/xml' });
     // console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'factura_' + nIdVenta + '.xml';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'comprobante de factura Generado', life: 3000 });
        //una vez generado el reporte limpia el formulario para una nueva venta o cotizaciÃ³n 

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de factura', life: 3000 });
      }

    });

  }

  descargarAcuseCancelacion(nIdVenta:number){
    this.facturaService.descargarDocumento(nIdVenta, TipoDoc.XML_ACUSE_CANCELACION).subscribe(resp => {
      const file = new Blob([resp], { type: 'application/xml' });
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'acuse_cancelacion_' + nIdVenta + '.xml';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Acuse de cancelaciÃ³n descargado.', life: 3000 });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Sin acuse', detail: 'No se encontrÃ³ acuse de cancelaciÃ³n para esta venta.', life: 3500 });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible descargar el acuse de cancelaciÃ³n.', life: 3500 });
    });
  }

  

}


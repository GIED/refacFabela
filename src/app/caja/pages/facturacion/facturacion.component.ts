import { Component, OnInit } from '@angular/core';
import {  MessageService } from 'primeng/api';
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
import { StatusCfdiResponse } from '../../../productos/model/StatusCfdiResponse';
import { CfdiRelacionadosResponse } from '../../../productos/model/CfdiRelacionadosResponse';
import { SolicitudCancelacionDto } from '../../../productos/model/SolicitudCancelacionDto';
import { SolicitudCancelacionAccionDto } from '../../../productos/model/SolicitudCancelacionAccionDto';
import { DatosFacturaDto } from '../../../productos/model/DatosFacturaDto';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

    listaVentas:TvVentasFactura[];
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
    estatusSat: StatusCfdiResponse;
    cfdiRelacionados: CfdiRelacionadosResponse;
    listaSolicitudesPendientes: SolicitudCancelacionDto[];
    listaDatosFactura: DatosFacturaDto[];
    nIdDatoFacturaSeleccionado?: number;
    cargandoSolicitudes:boolean;
    hayTimbresDisponibles:boolean;
    creditosTotales:number;

    readonly motivosCancelacion = [
      { label: '01 - Comprobante emitido con errores con relación', value: '01' },
      { label: '02 - Comprobante emitido con errores sin relación', value: '02' },
      { label: '03 - No se llevó a cabo la operación', value: '03' },
      { label: '04 - Operación nominativa relacionada en factura global', value: '04' }
    ];

    

  constructor(private facturaService: FacturaService, private catalogoService:CatalogoService, private messageService: MessageService, private ventasService: VentasService) {
        this.listaVentas=[];
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
          this.estatusSat = new StatusCfdiResponse();
          this.cfdiRelacionados = new CfdiRelacionadosResponse();
          this.listaSolicitudesPendientes = [];
          this.listaDatosFactura = [];
          this.cargandoSolicitudes = false;
          this.hayTimbresDisponibles = false;
          this.creditosTotales = 0;
     }

  ngOnInit(){
   this.obtenerFacruras();
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

    this.facturaService.obtenerVentaFactura().subscribe(resp =>{
      this.listaVentas=resp;

      //console.log(this.listaVentas);
  });
  this.obtenerUsocfdi();

  }
  obtenerVentasFacturadas(){

    this.facturaService.obtenerFacturas().subscribe(resp =>{
      this.listaVentas=resp;

      //console.log(this.listaVentas);
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



  openDialog(tvVentasFactura: TvVentasFactura) {
  this.ventasService.obtenerCobroParcial(tvVentasFactura.nId).subscribe(data => {
    this.ListaTrVentaCobro = data;
    this.nuevaFormaPago = '';

    if (this.ListaTrVentaCobro.length > 1) {
      for (let index = 0; index < this.ListaTrVentaCobro.length; index++) {
        this.nuevaFormaPago += this.ListaTrVentaCobro[index].tcFormapago?.sDescripcion + '/';
      }
    } else {
      for (let index = 0; index < this.ListaTrVentaCobro.length; index++) {
        this.nuevaFormaPago = this.ListaTrVentaCobro[index].tcFormapago?.sDescripcion ?? '';

        const monto = new Decimal(this.ListaTrVentaCobro[index].nMonto ?? 0); // ✅ conversión segura
        if (monto.greaterThanOrEqualTo(2000) && this.ListaTrVentaCobro[index].tcFormapago?.nId === 1) {
          this.efectivoValida = true;
        } else {
          this.efectivoValida = false;
        }
      }
    }

    if (tvVentasFactura.tcFormapago == null) {
      tvVentasFactura.tcFormapago = new TcFormaPago();
    }

    this.tvVentasFactura = tvVentasFactura;
    this.formFactura = true;
    this.idVenta = tvVentasFactura.nId;
    this.totalVenta = tvVentasFactura.nTotalVenta;

    const nIdDatoFactura = tvVentasFactura.tcCliente?.nIdDatoFactura;
    if (nIdDatoFactura) {
      this.nIdDatoFacturaSeleccionado = nIdDatoFactura;
      this.consultaCreditos(nIdDatoFactura);
    }

    if (
      this.tvVentasFactura.nTipoPago === 1 ||
      this.ListaTrVentaCobro.length > 1 ||
      this.efectivoValida
    ) {
      this.tvVentasFactura.formaPago = 22;
      this.tvVentasFactura.tcFormapago.nId = 22;
      this.tvVentasFactura.tcFormapago.sClave = '99';
      this.tvVentasFactura.tcFormapago.sDescripcion = 'Por definir';
      this.tvVentasFactura.tcFormapago.nEstatus = 1;
    }
  });
}

  openNew() { 

    this.clienteDialog = true;
    this.objCliente=this.tvVentasFactura.tcCliente; 
   
  }

  hideDialog(){
    this.formFactura=false;
  }

  generarFactura(){
    if (!this.hayTimbresDisponibles) {
        this.messageService.add({ severity: 'warn', summary: 'Sin Créditos', detail: 'No hay timbres disponibles para facturar.', life: 4000 });
        return;
    }

    this.facturaService.facturarVenta(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      this.formFactura=false;
      this.obtenerFacruras();
        this.messageService.add({ severity: 'success', summary: 'Factura generada', detail: 'La factura se generó correctamente.', life: 4000 });
        if (resp && resp.avisoCorreo) {
          this.messageService.add({ severity: 'warn', summary: 'Correo no enviado', detail: resp.avisoCorreo, life: 6000 });
        }
    });

  }

  generarComplemento(){
    if (!this.hayTimbresDisponibles) {
        this.messageService.add({ severity: 'warn', summary: 'Sin Créditos', detail: 'No hay timbres disponibles para generar el complemento.', life: 4000 });
        return;
    }

    this.facturaService.facturarComplemento(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      this.formFactura=false;
      this.obtenerFacruras();
      this.messageService.add({ severity: 'success', summary: 'Complemento generado', detail: 'El complemento se generó correctamente.', life: 4000 });
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
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Selecciona un motivo de cancelación.', life: 3000 });
      return;
    }

    if (this.motivoCancelacion === '01' && !this.folioFiscalSustitucion) {
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'El folio fiscal de sustitución es obligatorio para el motivo 01.', life: 4000 });
      return;
    }

    const payload = new CancelacionFacturaDto();
    payload.nIdVenta = this.ventaCancelar.nId;
    payload.motivo = this.motivoCancelacion;
    payload.folioFiscalSustitucion = this.folioFiscalSustitucion || null;

    this.facturaService.cancelarFactura(payload).subscribe(() => {
      this.messageService.add({ severity: 'success', summary: 'Factura cancelada', detail: 'La solicitud de cancelación se procesó correctamente.', life: 4000 });
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
      this.messageService.add({ severity: 'warn', summary: 'Validación', detail: 'Selecciona una razón social emisora.', life: 3000 });
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
      const mensaje = resp?.mensajeError ? resp.mensajeError : aceptar ? 'La solicitud se aceptó correctamente.' : 'La solicitud se rechazó correctamente.';
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
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 

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
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 

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
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Acuse de cancelación descargado.', life: 3000 });
      } else {
        this.messageService.add({ severity: 'warn', summary: 'Sin acuse', detail: 'No se encontró acuse de cancelación para esta venta.', life: 3500 });
      }
    }, () => {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No fue posible descargar el acuse de cancelación.', life: 3500 });
    });
  }

  

}

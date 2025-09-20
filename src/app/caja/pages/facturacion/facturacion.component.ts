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
    creditosRestantesFabela:number;
    creditosRestantesJemkal:number;
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

    

  constructor(private facturaService: FacturaService, private catalogoService:CatalogoService, private messageService: MessageService, private ventasService: VentasService) {
        this.listaVentas=[];
        this.listaUsoCfdi=[];
        this.formFactura=false;
        this.tvVentasFactura= new TvVentasFactura();
        this.clienteDialog= false;
        this.objCliente= new TcCliente();
        this.creditosRestantes=0;
        this.creditosRestantesFabela=0;
        this.creditosRestantesJemkal=0;
        this.nuevaFormaPago='';
        this.efectivoValida=false;
        this.subirFacturaDto=new SubirFacturaDto();
     }

  ngOnInit(){
   this.obtenerFacruras();
   this.obtenerUsocfdi();
   this.consultaCreditos();


    
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
  consultaCreditos(){

    this.facturaService.consultaCreditos(1).subscribe(resp =>{
      this.creditosRestantesFabela=resp;
  });
  this.facturaService.consultaCreditos(2).subscribe(resp =>{
    this.creditosRestantesJemkal=resp;
});

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
    //console.log(this.cfdiSeleccionado);
    // console.log(this.idVenta);

    this.facturaService.facturarVenta(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      this.formFactura=false;
      this.obtenerFacruras();
     // console.log(resp.mensaje);
    });

  }

  generarComplemento(){
   // console.log(this.cfdiSeleccionado);
   // console.log(this.idVenta);

    this.facturaService.facturarComplemento(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      this.formFactura=false;
      this.obtenerFacruras();
    //  console.log(resp.mensaje);
    });

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

  

}

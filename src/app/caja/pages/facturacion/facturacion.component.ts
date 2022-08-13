import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { FacturaService } from '../../../shared/service/factura.service';
import { TvVentasFactura } from '../../../productos/model/TvVentasFactura';
import { TcUsoCfdi } from '../../../productos/model/TcUsoCfdi';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TipoDoc } from 'src/app/shared/utils/TipoDoc.enum';
import { SpinnerComponent } from '../../../shared/spinner/spinner.component';

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
    

  constructor(private facturaService: FacturaService, private catalogoService:CatalogoService, private messageService: MessageService) {
        this.listaVentas=[];
        this.listaUsoCfdi=[];
        this.formFactura=false;
     }

  ngOnInit(){
   this.obtenerFacruras();
   this.catalogoService.obtenerUsoCfdi().subscribe(resp =>{
     this.listaUsoCfdi=resp;
   });


    
  }

  obtenerFacruras(){

    this.facturaService.obtenerVentaFactura().subscribe(resp =>{
      this.listaVentas=resp;

      console.log(this.listaVentas);
  });

  }

  openDialog(tvVentasFactura:TvVentasFactura){
    this.formFactura=true;
    this.idVenta=tvVentasFactura.nId;
    this.totalVenta=tvVentasFactura.nTotalVenta;
  }

  hideDialog(){
    this.formFactura=false;
  }

  generarFactura(){
    console.log(this.cfdiSeleccionado);
    console.log(this.idVenta);

    this.facturaService.facturarVenta(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      this.formFactura=false;
      this.obtenerFacruras();
      console.log(resp.mensaje);
    });

  }


  descargarFactura(nIdVenta:number){

    console.log();

    this.facturaService.descargarDocumento(nIdVenta, TipoDoc.PDF_FACTURA ).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
      console.log('file: ' + file.size);
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

    console.log();

    this.facturaService.descargarDocumento(nIdVenta, TipoDoc.XML_FACTURA ).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/xml' });
      console.log('file: ' + file.size);
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

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from '../../../shared/service/ventas.service';
import { VentaProductoDto } from '../../model/dto/VentaProductoDto';



@Component({
  selector: 'app-consulta-venta',
  templateUrl: './consulta-venta.component.html',
  styleUrls: ['./consulta-venta.component.scss']
})
export class ConsultaVentaComponent implements OnInit {

  productDialog: boolean;
    selectedProducts: Product[];
    selectedProducts2:VentaProductoDto;
    submitted: boolean;
    cols: any[];
    detalleDialog: boolean;   
    titulo:string;
    formaPago:any;
    usoCfdi:any;
    mostrarProductos:boolean;
    buscar:string;
    myDate:Date;

    listaVentasDetalleCliente: TvVentasDetalle[];
    listaProductosVenta:VentaProductoDto;

  constructor(  private ventasService:VentasService,  private messageService: MessageService,   ) {

    this.cols = [
      { field: 'sFolioVenta', header: 'Folio' },
      { field: 'tcCliente.sRfc', header: 'RFC' },
      { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
      { field: 'nTotalVenta', header: 'Total Venta' },
      { field: 'dFechaVenta', header: 'Fecha de Venta' },
      { field: 'tcUsuario.sNombreUsuario', header: 'Vendedor' },
     
  ]
   }

  ngOnInit(){
     this.ventasService.obtenerVentasTop().subscribe(data=>{
     this.listaVentasDetalleCliente=data; 
     //console.log( this.listaVentasDetalleCliente);

    
     for (let index = 0; index <  this.listaVentasDetalleCliente.length; index++) {

      let fecha = new Date(this.listaVentasDetalleCliente[index].dFechaVenta);

      fecha.setDate(fecha.getDate() + 1);

      this.listaVentasDetalleCliente[index].dFechaVenta=fecha;

     // console.log(fecha);
      
  
      
     }     
    
    }); 
  }

  generarsSaldoFacorPdf(tvVentasDetalle:TvVentasDetalle){

    this.ventasService.generarSaldoFavorPdf(tvVentasDetalle.nId).subscribe(resp => {
  
    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'saldo_favor_' + tvVentasDetalle.nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'comprobante de saldo a favor generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de saldo a favor', life: 3000});
      }
  
  });
  
  }
 

detalleVentaProductos(tvVentasDetalle:TvVentasDetalle){

  this.mostrarProductos=true;

  this.ventasService.obtenerProductoVentaId(tvVentasDetalle.nId).subscribe(data => {
      this.listaProductosVenta=data;
  })

}

hideDialogAlter(){
  this.mostrarProductos=false;
}

consultar(){

  if(this.buscar !== undefined && this.buscar.length >=1 ){
    this.ventasService.obtenerVentasLike(this.buscar).subscribe(data => {
      this.listaVentasDetalleCliente=data;
      //console.log(this.listaVentasDetalleCliente);
    }); 

  }
  else 
  {
   
  }

  

 

}

consultarTodas(){

  if(this.buscar !== undefined && this.buscar.length >=1 ){
    this.ventasService.obtenerVentaDetalle().subscribe(data => {
      this.listaVentasDetalleCliente=data;
      //console.log(this.listaVentasDetalleCliente);
    }); 

  }
  else 
  {
   
  }
}






createId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < 5; i++ ) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

generarVentaPdf(tvVentasDetalle:TvVentasDetalle){

  this.ventasService.generarVentaPdf(tvVentasDetalle.nId).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + tvVentasDetalle.nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'comprobante de venta Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
      }

  });

}

generarVentaPedidoPdf(tvVentasDetalle:TvVentasDetalle){

  this.ventasService.generarVentaPedidoPdf(tvVentasDetalle.nId).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + tvVentasDetalle.nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'comprobante de venta Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
      }

  });

}



}

function addDayToDate(dFechaVenta: Date, arg1: number): any {
  throw new Error('Function not implemented.');
}

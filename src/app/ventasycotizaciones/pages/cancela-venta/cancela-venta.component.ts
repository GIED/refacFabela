import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { VentaProductoDto } from '../../model/dto/VentaProductoDto';
import { VentaProductoCancelaDto } from '../../model/dto/VentaProductoCancelaDto';

@Component({
  selector: 'app-cancela-venta',
  templateUrl: './cancela-venta.component.html',
  styleUrls: ['./cancela-venta.component.scss']
})
export class CancelaVentaComponent implements OnInit {

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
  borrar:boolean;

  listaVentasDetalleCliente: TvVentasDetalle[];
  listaProductosVenta:VentaProductoDto;
  mostrarCancela:Boolean=false;
  producto:String;
  totalVendidos:number;
  totalCancelar:number;
  sMotivo:string;
  penaliza:boolean;  
  ventaProductoDto:VentaProductoDto;
  VentaProductoCancelaDto:VentaProductoCancelaDto;
  mostrarCancelados:boolean;
  nIdVenta:number;


constructor(  private ventasService:VentasService,  private messageService: MessageService,  ) {

  this.cols = [
    { field: 'sFolioVenta', header: 'Folio' },
    { field: 'tcCliente.sRfc', header: 'RFC' },
    { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
    { field: 'nTotalVenta', header: 'Total Venta' },
    { field: 'dFechaVenta', header: 'Fecha de Venta' },
    { field: 'tcUsuario.sNombreUsuario', header: 'Vendedor' },
   
]
this.VentaProductoCancelaDto=new VentaProductoCancelaDto();
this.penaliza=false;
 }

ngOnInit(){
   this.obtenerVentasCliente();
}

obtenerVentasCliente(){
  
  this.ventasService.obtenerVentasTop().subscribe(data=>{
    this.listaVentasDetalleCliente=data; 
    //console.log(this.listaVentasDetalleCliente);      
   
   }); 

}
hideDialogAlter3(){
  this.mostrarCancelados=false;

}

cancelados(venta: TvVentasDetalle){

  this.mostrarCancelados=true;
  this.nIdVenta=venta.nId;

}

cerrarDialogCancela(){

this.mostrarCancela=false;

}

detalleVentaProductos(tvVentasDetalle:TvVentasDetalle){

this.mostrarProductos=true;

if(tvVentasDetalle.nIdTipoVenta==3){
  this.borrar=false;
  

}
else{
  this.borrar=true;
}

this.ventasService.obtenerProductoVentaId(tvVentasDetalle.nId).subscribe(data => {
    this.listaProductosVenta=data;
})

}

consultarTodas(){

  
    this.ventasService.obtenerVentaDetalle().subscribe(data => {
      this.listaVentasDetalleCliente=data;
      //console.log(this.listaVentasDetalleCliente);
    }); 

 
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

cancelaVenta(ventaProductoDto:VentaProductoDto){
  
  this.ventaProductoDto=ventaProductoDto;
  this.mostrarCancela=true;
  this.producto=ventaProductoDto.sNoParte+'-'+ventaProductoDto.sProducto;
  this.totalVendidos=ventaProductoDto.nCantidad;
  this.VentaProductoCancelaDto.VentaProductoDto=ventaProductoDto;

 
  
  }

  concelarVentaProducto(){

    if(this.totalCancelar!=undefined && this.totalCancelar!=null && this.sMotivo!=null && this.sMotivo!=undefined){

     
     this.VentaProductoCancelaDto.nCancela=this.totalCancelar;
     this.VentaProductoCancelaDto.sMotivo=this.sMotivo;
     this.VentaProductoCancelaDto.penaliza=this.penaliza;

     console.log( this.VentaProductoCancelaDto.penaliza);


      this.ventasService.cancelarVentaProducto(this.VentaProductoCancelaDto).subscribe(data => {
        this.mostrarProductos=false;
        this.mostrarCancela=false;
       
        this.obtenerVentasCliente();  
        this.totalCancelar=null;
        this.VentaProductoCancelaDto.nCancela=null;
        this.VentaProductoCancelaDto.sMotivo=null;
        this.VentaProductoCancelaDto.penaliza=null;
       
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Se cancelo el producto con éxito', life: 3000});
         })

    }
    else{

      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Debe registrar todos los campos requeridos', life: 3000});
    }

  }

hideDialogAlter(){
this.mostrarProductos=false;
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


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
  this.mostrarCancela = false;
  // Limpiar el formulario al cerrar sin completar
  this.limpiarFormularioCancelacion();
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
  // Limpiar datos previos antes de abrir el diálogo
  this.limpiarFormularioCancelacion();
  
  // Asignar nuevos datos
  this.ventaProductoDto = ventaProductoDto;
  this.mostrarCancela = true;
  this.producto = ventaProductoDto.sNoParte + '-' + ventaProductoDto.sProducto;
  this.totalVendidos = ventaProductoDto.nCantidad;
  
  // Crear nuevo DTO con el producto seleccionado
  this.VentaProductoCancelaDto = new VentaProductoCancelaDto();
  this.VentaProductoCancelaDto.VentaProductoDto = ventaProductoDto;
}

  concelarVentaProducto(){
    // Validación 1: Cantidad a cancelar existe
    if(this.totalCancelar == undefined || this.totalCancelar == null) {
      this.messageService.add({
        severity: 'error', 
        summary: 'Error', 
        detail: 'Debe ingresar la cantidad a cancelar', 
        life: 3000
      });
      return;
    }

    // Validación 2: Motivo existe y no está vacío
    if(this.sMotivo == null || this.sMotivo == undefined || this.sMotivo.trim() === '') {
      this.messageService.add({
        severity: 'error', 
        summary: 'Error', 
        detail: 'Debe ingresar el motivo de cancelación', 
        life: 3000
      });
      return;
    }

    // Validación 3: Cantidad positiva
    if(this.totalCancelar <= 0) {
      this.messageService.add({
        severity: 'error', 
        summary: 'Error', 
        detail: 'La cantidad a cancelar debe ser mayor a 0', 
        life: 3000
      });
      return;
    }

    // Validación 4: No cancelar más de lo vendido
    if(this.totalCancelar > this.totalVendidos) {
      this.messageService.add({
        severity: 'error', 
        summary: 'Cantidad Inválida', 
        detail: `No puede cancelar ${this.totalCancelar} unidades. Solo se vendieron ${this.totalVendidos} unidades de este producto`, 
        life: 4000
      });
      return;
    }

    // Asignar valores al DTO
    this.VentaProductoCancelaDto.nCancela = this.totalCancelar;
    this.VentaProductoCancelaDto.sMotivo = this.sMotivo.trim();
    this.VentaProductoCancelaDto.penaliza = this.penaliza;

    // Realizar la petición al servidor
    this.ventasService.cancelarVentaProducto(this.VentaProductoCancelaDto).subscribe(
      data => {
        // Guardar la cantidad cancelada para el mensaje
        const cantidadCancelada = this.totalCancelar;
        const nombreProducto = this.producto;

        // Cerrar diálogos
        this.mostrarProductos = false;
        this.mostrarCancela = false;
       
        // Limpiar formulario completamente
        this.limpiarFormularioCancelacion();
        
        // Recargar datos
        this.obtenerVentasCliente();
        
        // Mensaje de éxito con información específica
        this.messageService.add({
          severity: 'success', 
          summary: 'Cancelación Exitosa', 
          detail: `Se cancelaron ${cantidadCancelada} unidades del producto ${nombreProducto}`, 
          life: 4000
        });
      },
      error => {
        // Manejo de errores del servidor
        console.error('Error al cancelar venta:', error);
        this.messageService.add({
          severity: 'error', 
          summary: 'Error en el Servidor', 
          detail: 'No se pudo procesar la cancelación. Intente nuevamente', 
          life: 3000
        });
      }
    );
  }

  limpiarFormularioCancelacion() {
    // Limpiar todas las variables del formulario
    this.totalCancelar = null;
    this.sMotivo = null;
    this.penaliza = false;
    this.totalVendidos = null;
    this.producto = null;
    this.ventaProductoDto = null;
    
    // Reinicializar completamente el DTO para evitar datos residuales
    this.VentaProductoCancelaDto = new VentaProductoCancelaDto();
  }

  validarCantidadCancelar(event: any) {
    // Validar que no exceda el máximo permitido
    if (this.totalCancelar && this.totalVendidos) {
      if (this.totalCancelar > this.totalVendidos) {
        // Limitar automáticamente al máximo
        setTimeout(() => {
          this.totalCancelar = this.totalVendidos;
          this.messageService.add({
            severity: 'warn',
            summary: 'Cantidad Ajustada',
            detail: `La cantidad máxima a cancelar es ${this.totalVendidos} unidades`,
            life: 3000
          });
        }, 100);
      }
      
      // Validar que sea un número positivo
      if (this.totalCancelar < 1) {
        setTimeout(() => {
          this.totalCancelar = 1;
          this.messageService.add({
            severity: 'warn',
            summary: 'Cantidad Ajustada',
            detail: 'La cantidad mínima es 1 unidad',
            life: 3000
          });
        }, 100);
      }
    }
  }

hideDialogAlter(){
  this.mostrarProductos = false;
  // Limpiar formulario de cancelación si estaba abierto
  if(this.mostrarCancela) {
    this.limpiarFormularioCancelacion();
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


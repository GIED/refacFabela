import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { validators } from 'src/app/shared/validators/validators';
import { VentaProductoDto } from '../../model/dto/VentaProductoDto';

@Component({
  selector: 'app-descuento-venta',
  templateUrl: './descuento-venta.component.html',
  styleUrls: ['./descuento-venta.component.scss']
})
export class DescuentoVentaComponent implements OnInit {

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

  listaVentasDetalleCliente: TvVentasDetalle[];
  listaProductosVenta:VentaProductoDto;
  abrirformulario: boolean;
  formulario: FormGroup;
  VentaDescuentoDto:TvVentasDetalle;

constructor(  private ventasService:VentasService,  private messageService: MessageService, private fb: FormBuilder ) {

  this.cols = [
    { field: 'sFolioVenta', header: 'Folio' },
    { field: 'tcCliente.sRfc', header: 'RFC' },
    { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
    { field: 'nTotalVenta', header: 'Total Venta' },
    { field: 'dFechaVenta', header: 'Fecha de Venta' },
    { field: 'tcUsuario.sNombreUsuario', header: 'Vendedor' }
 
]
 }

ngOnInit(){

  this.crearFormulario();

  this.consultaVentas();
 
}

consultaVentas(){

  this.ventasService.obtenerVentaDetalleEstatusVenta(1).subscribe(data=>{
    this.listaVentasDetalleCliente=data; 
    //console.log(this.listaVentasDetalleCliente);      
   
   }); 
}

crearFormulario() {

  this.formulario = this.fb.group({

    descuento: ['', [Validators.required, Validators.pattern(validators.numero)]],

  });

}
cerrarModal() {
  this.abrirformulario = false;

  this.limpiaFormulario();

}
limpiaFormulario() {
  this.fProducto.descuento.setValue("");
 }

abrir(tvVentasDetalle:TvVentasDetalle){

  this.VentaDescuentoDto=tvVentasDetalle;

  if(tvVentasDetalle.descuento>0){
    this.fProducto.descuento.setValue(tvVentasDetalle.descuento);
  }
  //console.log(tvVentasDetalle);
  this.abrirformulario=true;

 
}


get validaDescuento() {
  return this.formulario.get('descuento').invalid && this.formulario.get('descuento').touched;
}


get fProducto() {
  return this.formulario.controls;
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

guardarDescuento() {

  if (this.formulario.invalid) {
    return Object.values(this.formulario.controls).forEach(control => {

      if (control instanceof FormGroup) {
        // tslint:disable-next-line: no-shadowed-variable

        Object.values(control.controls).forEach(control => control.markAsTouched());
      } else {
        control.markAsTouched();
      }

    });

  }
  else {

    this.VentaDescuentoDto.descuento= this.fProducto.descuento.value;

    //console.log(this.VentaDescuentoDto.descuento);

    if(this.VentaDescuentoDto.nSaldoTotal>this.VentaDescuentoDto.descuento){
    
    this.ventasService.guardarVentaDescuento(this.VentaDescuentoDto).subscribe(data=>{

    this.consultaVentas();
     
    this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Se guardo el descuento', life: 3000});


    });
    this.limpiaFormulario();
    this.abrirformulario=false;
  }
  else{
    this.messageService.add({severity: 'error', summary: 'Error', detail: 'El descuento no puede ser superior al saldo final', life: 3000});

  }
  

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
      this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'comprobante de venta Generado', life: 3000});
      //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
     
    } else {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
    }

});

}

}

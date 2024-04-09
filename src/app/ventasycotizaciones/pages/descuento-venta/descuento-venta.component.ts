import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { validators } from 'src/app/shared/validators/validators';
import { VentaProductoDto } from '../../model/dto/VentaProductoDto';
import { TwVentasProducto } from '../../../productos/model/TwVentasProducto';
import { CalculaPrecioDto } from 'src/app/productos/model/CalculaPrecioDto';


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
  twVentasProducto: TwVentasProducto;
  mostrarSimulador:boolean;
  nuevoPrecioUnitario:number;
  calculaPrecio:CalculaPrecioDto;
  banGuardar:boolean;

constructor(  private ventasService:VentasService,  private messageService: MessageService, private fb: FormBuilder ) {

  this.cols = [
    { field: 'sFolioVenta', header: 'Folio' },
    { field: 'tcCliente.sRfc', header: 'RFC' },
    { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
    { field: 'nTotalVenta', header: 'Total Venta' },
    { field: 'dFechaVenta', header: 'Fecha de Venta' },
    { field: 'tcUsuario.sNombreUsuario', header: 'Vendedor' }
 
]
  this.twVentasProducto=new TwVentasProducto();
  this.calculaPrecio= new CalculaPrecioDto();
  this.banGuardar=false;


 }

ngOnInit(){

  this.crearFormulario();

  this.consultaVentas();
 
}

consultaVentas(){

  this.ventasService.obtenerVentaDetalleEstatusVenta(8).subscribe(data=>{
    this.listaVentasDetalleCliente=data; 
    //console.log(this.listaVentasDetalleCliente);      
   
   }); 
}

crearFormulario() {

  this.formulario = this.fb.group({

    descuento: ['', [Validators.required, Validators.pattern(validators.numero)]],

  });

}

abrirAjustePrecio( ventaProductoDto:VentaProductoDto){

  console.log(ventaProductoDto);

  this.ventasService.obtenerVentaProductoId(ventaProductoDto.nIdVenta,ventaProductoDto.nIdProducto).subscribe(data=>{
    this.twVentasProducto=data;
    console.log(this.twVentasProducto);
    this.mostrarSimulador=true;
    this.nuevoPrecioUnitario=this.twVentasProducto.nPrecioUnitario;

  })


  
}

cerrarDialogCancela(){
  this.mostrarSimulador=false;
  this.twVentasProducto=null;
  


}

guardarNuevoPrecio(){

  this.ventasService.actualizaVentaProducto(this.twVentasProducto).subscribe(data=>{

    console.log('Se guardo esta información',data);
    this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Se guardo el descuento', life: 3000});
    this.mostrarProductos=false;
    this.mostrarSimulador=false;
    this.consultaVentas();
   
    this.banGuardar=false;

  })

}

calcularNuevoPrecio(){
  console.log('Estó es lo que se tiene que consultar',this.twVentasProducto);
  this.calculaPrecio.cantidad=this.twVentasProducto.nCantidad;
  this.calculaPrecio.precioUnitario=this.nuevoPrecioUnitario;

this.ventasService.calcularNuevoPrecioAjustado( this.calculaPrecio).subscribe(data=>{

  this.calculaPrecio=data;


  this.twVentasProducto.nPrecioUnitario=this.calculaPrecio.precioUnitario;
  this.twVentasProducto.nIvaUnitario=this.calculaPrecio.ivaUnitario;
  this.twVentasProducto.nTotalUnitario=this.calculaPrecio.totalUnitario;
  this.twVentasProducto.nPrecioPartida=this.calculaPrecio.precioPartida;
  this.twVentasProducto.nIvaPartida=this.calculaPrecio.ivaPartida;
  this.twVentasProducto.nTotalPartida=this.calculaPrecio.totalPartida;

  this.banGuardar=true;


})

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

    if(this.VentaDescuentoDto.nSaldoTotal>=this.VentaDescuentoDto.descuento){

      if((this.VentaDescuentoDto.nSaldoTotal-this.VentaDescuentoDto.descuento)<0.02){

        this.VentaDescuentoDto.descuento=this.VentaDescuentoDto.nSaldoTotal;

      }
    
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

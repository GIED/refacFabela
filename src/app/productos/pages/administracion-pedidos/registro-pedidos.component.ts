import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { PedidosService } from '../../../shared/service/pedidos.service';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';
import { TwPedidoProducto } from '../../model/TwPedidoProducto';

import { TcProducto } from '../../model/TcProducto';
import { TwProductoBodega } from '../../model/TwProductoBodega';
import { TvPedidoDetalle } from '../../model/TvPedidoDetalle';

@Component({
  selector: 'app-registro-pedidos',
  templateUrl: './registro-pedidos.component.html',
  styleUrls: ['./registro-pedidos.component.scss']
})
export class RegistroPedidosComponent implements OnInit {

  listaPedidos:TwPedidoProducto[];
  productDialog: boolean = false;
    detalleDialog: boolean = false;
    alternativosDialog: boolean = false;
    muestraConfirmDialog: boolean = false;
    selectedProducts: TcProducto[];
    cols: any[];
    lineOptions: any;
    lineData: any;
    producto: TcProducto;
    listaProductos: TcProducto[];
    listaHistoriaPrecioProducto: TcHistoriaPrecioProducto[];

    listaProductoBodega: TwProductoBodega[];
    titulo: string;
    stockTotal: number = 0;
    nIdProducto: number;
    sProducto: string;
    traspaso:boolean=false;
    listaPedidoDetalle:TvPedidoDetalle[];
    registroPedido:boolean;
   

  constructor(private pedidosService: PedidosService,  private productosService: ProductoService,
    private bodegasService: BodegasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService, ) { }

  ngOnInit(): void {
  
    this.obtenerPedidosEstatus();
  }

  consultaProductosRegistrados(nId:number){
   

    this.pedidosService.obtenerProductosPedido(nId).subscribe(data=>{
   this.listaPedidos=data;
   console.log(this.listaPedidos);
   this.detalleDialog=true;


    })


  }

  cerrarNuevoPedido(){
    this.registroPedido=false;
  }

 
 

 obtenerPedidosEstatus(){


  this.pedidosService.obtenerPedidosDetalleEstatus(0).subscribe(data=>{
  this.listaPedidoDetalle=data;

    
  })

 }

 recatgarPedidodEstatus(listaPedidoDetalle:TvPedidoDetalle[]){
this.listaPedidoDetalle=listaPedidoDetalle;
this.registroPedido=false;


 }

 

nuevoPedido(){

  console.log("entre a ocultar el modal");
  this.registroPedido=true;
  this.obtenerPedidosEstatus();
}
 


hideDialog(valor: boolean) {
  this.productDialog = valor;
}
hideDialogAlternativos() {
  this.alternativosDialog = false;
}
hideDialogDetalle() {
  this.detalleDialog = false;
}

generarPedidoPdf(nId:number){

  console.log("Se va a generar el comprobante");

  this.pedidosService.generarPedidoPdf(nId).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'pedido_' +nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Comprobante de Pedido Generado', life: 6000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se puedo generar el comprobante del pedido', life: 6000});
      }

  });

}






}

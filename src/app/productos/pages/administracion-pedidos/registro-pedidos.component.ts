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

  consultaProductosRegistrados(mId:number){
    this.detalleDialog=true;

    this.pedidosService.obtenerProductosPedido(mId).subscribe(data=>{
   this.listaPedidos=data;
   console.log(this.listaPedidos);


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




}

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TcHistoriaPrecioProducto } from 'src/app/productos/model/TcHistoriaPrecioProducto';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { TvPedidoDetalle } from 'src/app/productos/model/TvPedidoDetalle';
import { TwPedidoProducto } from 'src/app/productos/model/TwPedidoProducto';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { PedidosService } from '../../../shared/service/pedidos.service';


@Component({
  selector: 'app-ingreso-mercancia',
  templateUrl: './ingreso-mercancia.component.html',
  styleUrls: ['./ingreso-mercancia.component.scss']
})
export class IngresoMercanciaComponent implements OnInit {

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
    banIngreso=true;

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

    
  });

 }

 obtenerPedidosEstatusActualiza(PedidoDetalle:TvPedidoDetalle[]){

  this.listaPedidoDetalle=PedidoDetalle;

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



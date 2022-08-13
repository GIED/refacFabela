import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { PedidosService } from '../../../shared/service/pedidos.service';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';

import { TcProducto } from '../../model/TcProducto';
import { TwPedidoProducto } from '../../model/TwPedidoProducto';
import { TwProductoBodega } from '../../model/TwProductoBodega';
import { TvPedidoDetalle } from '../../model/TvPedidoDetalle';

@Component({
  selector: 'app-pedido-productos',
  templateUrl: './pedido-productos.component.html',
  styleUrls: ['./pedido-productos.component.scss']
})
export class PedidoProductosComponent implements OnInit {

  @Input() listaPedidos: TwPedidoProducto[];
  @Input() banIngreso: boolean;
  @Output() listaPedidoDetalle: EventEmitter<TvPedidoDetalle[]>=new EventEmitter();



  
  

 
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
    mostrarEntrega:boolean=false;
    submitted:boolean=false;
    pedido:TwPedidoProducto;
    

    constructor(private pedidosService: PedidosService,  private productosService: ProductoService,
      private bodegasService: BodegasService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService, ) { }

  ngOnInit(): void {

    console.log(this.banIngreso);
    
  }

  consultaProductosRegistrados(nId:number){

    this.pedidosService.obtenerProductosPedido(nId).subscribe(data=>{
   this.listaPedidos=data;
   console.log(this.listaPedidos);


    })


  }


  openNew() {
    this.producto = null;
    this.productDialog = true;
    this.titulo = "Registro de Productos"
}

editarProducto(producto: TcProducto) {
    this.producto = producto;
    this.productDialog = true;
    this.titulo = "Actualiza de Producto"
}


alternativosProduct(nId: number, sProducto: string) {
    this.nIdProducto = nId;
    this.sProducto = sProducto;
    this.alternativosDialog = true;
}

detalleProduct(nId: number) {
    this.detalleDialog = true;
    this.stockTotal = 0;
    this.productosService.historiaPrecioProducto(nId).subscribe(productos => {
        this.listaHistoriaPrecioProducto = productos;
    });

    this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega => {
        this.listaProductoBodega = productoBodega;
        for (const key in productoBodega) {
            this.stockTotal += this.listaProductoBodega[key].nCantidad;
        }
    });

  
}


mostrarRegistroEntrada(pedidos:TwPedidoProducto ) {
  
  this.pedido=pedidos;
this.mostrarEntrega=true;
this.submitted = false;

console.log(pedidos);



}
saveProduct(producto: TcProducto) {

  console.log(producto);

  if (producto.nId) {
      this.productosService.guardaProducto(producto).subscribe(productoActualizado => {
         
          this.messageService.add({ severity: 'success', summary: 'Producto Actualizado', detail: 'Producto actualizado correctamente', life: 3000 });
      });
  }
  else {
      this.productosService.guardaProducto(producto).subscribe(productoNuevo => {
        
          this.messageService.add({ severity: 'success', summary: 'Registro Correcto', detail: 'Producto registrado correctamente', life: 3000 });
      });
  }
  this.productDialog = false;
  
}

guardarIngresoProducto(){

  this.entregaProducto(this.pedido);

}
cerrar(){
  this.mostrarEntrega=false;

}

entregaProducto(producto:TwPedidoProducto){

  if(producto.nCantidadPedida==producto.nCantidaRecibida){
    producto.nEstatus=true;

  }

 this.pedidosService.guardaIngresoProductoPedido(producto).subscribe(data=>{

  for (let index = 0; index < this.listaPedidos.length; index++) {
    if(this.listaPedidos[index].nId==data.nId){
       
      this.listaPedidos[index].nEstatus=data.nEstatus;
      this.listaPedidos[index].dFechaRecibida=data.dFechaRecibida;
      
      
    }
    this.mostrarEntrega=false;
    
  }

  this.messageService.add({ severity: 'success', summary: 'Registro Correcto', detail: 'Se registro el ingreso del producto', life: 3000 });
  this.obtenerPedidoDetalle();

 });


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

findIndexById(id: number): number {
  let index = -1;
  for (let i = 0; i < this.listaProductos.length; i++) {
      if (this.listaProductos[i].nId === id) {
          index = i;
          break;
      }
  }
  return index;
}

obtenerPedidoDetalle(){
  this.pedidosService.obtenerPedidosDetalleEstatus(0).subscribe(data=>{
      this.listaPedidoDetalle.emit(data);
      console.log(data);
    });
}
createId(): string {
  let id = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

}

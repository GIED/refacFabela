import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { PedidosService } from '../../../shared/service/pedidos.service';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';

import { TcProducto } from '../../model/TcProducto';
import { TwPedidoProducto } from '../../model/TwPedidoProducto';
import { TwProductoBodega } from '../../model/TwProductoBodega';

@Component({
  selector: 'app-pedido-productos',
  templateUrl: './pedido-productos.component.html',
  styleUrls: ['./pedido-productos.component.scss']
})
export class PedidoProductosComponent implements OnInit {

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

    constructor(private pedidosService: PedidosService,  private productosService: ProductoService,
      private bodegasService: BodegasService,
      private messageService: MessageService,
      private confirmationService: ConfirmationService, ) { }

  ngOnInit(): void {
    this.consultaProductosRegistrados();
  }

  consultaProductosRegistrados(){

    this.pedidosService.obtenerProductosPedido(1).subscribe(data=>{
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
createId(): string {
  let id = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

}

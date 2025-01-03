import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VwMetaProductoCompra } from '../../model/VwMetaProductoCompra';
import { TwCarritoCompraPedido } from '../../model/TwCarritoCompraPedido';
import { ComprasService } from '../../../shared/service/compras.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-carrito-pedido',
  templateUrl: './carrito-pedido.component.html',
  styleUrls: ['./carrito-pedido.component.scss']
})
export class CarritoPedidoComponent implements OnInit {


  @Input() listaTwCarritoCompraPedido:TwCarritoCompraPedido[];
  @Output() cerrar: EventEmitter<Boolean> = new EventEmitter();
  cols: any[];
  


  constructor(private comprasService:ComprasService, private messageService: MessageService) { 

    this.cols = [
      { field: 'tcProducto.sNoParte', header: 'No Parte' },
      { field: 'tcProducto.sProducto', header: 'Producto' },
      { field: 'tcProducto.sMarca', header: 'Marca' },
      { field: 'dFechaRegistro', header: 'Fecha Registro' },
      { field: 'nCantidad', header: 'Cantidad' },
      { field: 'tcProveedor.sRazonSocial', header: 'Proveedor' }
    ];

  }

  ngOnInit(): void {

    

  }

  addProduct(){

  }

  deleteProductoCarrito(twCarritoCompraPedido:TwCarritoCompraPedido){

   
    this.comprasService.deteteCarritoCompraProducto(twCarritoCompraPedido.nId).subscribe(data=>{

     if(data){        
      this.messageService.add({ severity: 'success', summary: 'Registro borrado', detail: 'El producto fue descartado del pedido', life: 3000 });
      this.cerrar.emit(true);

     }
     else{
      this.messageService.add({ severity: 'danger', summary: 'Registro no borrado', detail: 'El producto no puedo eliminarse de la lista', life: 3000 });

     }

    });





  }

  

}

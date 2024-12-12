import { Component, Input, OnInit } from '@angular/core';
import { VwMetaProductoCompra } from '../../model/VwMetaProductoCompra';
import { TwCarritoCompraPedido } from '../../model/TwCarritoCompraPedido';

@Component({
  selector: 'app-carrito-pedido',
  templateUrl: './carrito-pedido.component.html',
  styleUrls: ['./carrito-pedido.component.scss']
})
export class CarritoPedidoComponent implements OnInit {


  @Input() listaTwCarritoCompraPedido:TwCarritoCompraPedido[];

  constructor() { }

  ngOnInit(): void {

  }

  addProduct(){

  }

  

}

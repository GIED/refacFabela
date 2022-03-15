import { Component, Input, OnInit } from '@angular/core';
import { TwProductoBodega } from '../../model/TwProductoBodega';

@Component({
  selector: 'app-modal-productos-bodega',
  templateUrl: './modal-productos-bodega.component.html',
  styleUrls: ['./modal-productos-bodega.component.scss']
})
export class ModalProductosBodegaComponent implements OnInit {

  @Input() listaProductoBodega: TwProductoBodega[];
  @Input() stockTotal: number;
  @Input() traspaso:boolean;
  bodegasDialog: boolean;
  titulo:string;
  productoBodega:TwProductoBodega;

  constructor() { }

  ngOnInit(): void {
  
  }

  editarProducto(bodega:TwProductoBodega){
    this.bodegasDialog=true;
    this.titulo="Movimiento de mercancia";
    this.productoBodega=bodega;
    
  }

 

}
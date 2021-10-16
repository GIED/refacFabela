import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/demo/domain/product';

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styles: [
  ]
})
export class ModalProductoComponent implements OnInit {

  @Input() productDialog: boolean;
  @Input() submitted: boolean;
  @Input() titulo:string;

  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Output() guardarProducto: EventEmitter<Product> = new EventEmitter();

  product: Product = {};

  constructor() { }

  ngOnInit(): void {
  }

  hideDialog() {
    this.cerrar.emit(false);
  }

  saveProduct(){
   // if (this.submitted) {
      this.guardarProducto.emit(this.product);
    //}  
  }

}

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

  constructor() { }

  ngOnInit(): void {
  
  }

 

}

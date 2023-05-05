import { Component, Input, OnInit } from '@angular/core';
import { TwProductoCancela } from '../../model/TwProductoCancela';
import { MessageService } from 'primeng/api';
import { ProductoService } from 'src/app/shared/service/producto.service';

@Component({
  selector: 'app-productos-cancelados',
  templateUrl: './productos-cancelados.component.html',
  styleUrls: ['./productos-cancelados.component.scss']
})
export class ProductosCanceladosComponent implements OnInit {

  @Input() nIProducto:number;
  listaProductosCancelados: TwProductoCancela[];
  constructor(private messageService: MessageService, private productoService: ProductoService) {
    this.listaProductosCancelados=[];
   }

  ngOnInit(): void {

    this.obtenerProductosCancelados(this.nIProducto);
  }

  obtenerProductosCancelados(nId:number){

    

    this.productoService.productosCanceladosId(nId).subscribe(data=>{
      this.listaProductosCancelados=data;

  })




}

}

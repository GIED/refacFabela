import { Component, Input, OnInit } from '@angular/core';
import { VentaProductoDto } from '../../model/dto/VentaProductoDto';

@Component({
  selector: 'app-venta-productos-detalle',
  templateUrl: './venta-productos-detalle.component.html',
  styleUrls: ['./venta-productos-detalle.component.scss']
})
export class VentaProductosDetalleComponent implements OnInit {
  
  @Input() listaProductosVenta:VentaProductoDto;
  selectedProducts2:VentaProductoDto;

  constructor() { }

  ngOnInit(): void {
  }

}

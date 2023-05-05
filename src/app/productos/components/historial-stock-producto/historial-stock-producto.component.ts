import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TvStockProductoHist } from 'src/app/productos/model/TvStrockProductoHist';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { VentasCotizacionesService } from 'src/app/shared/service/ventas-cotizaciones.service';

@Component({
  selector: 'app-historial-stock-producto',
  templateUrl: './historial-stock-producto.component.html',
  styleUrls: ['./historial-stock-producto.component.scss']
})
export class HistorialStockProductoComponent implements OnInit {

  @Input() nIProducto:number;
  listaVentasProductoStock: TvStockProductoHist[];

  constructor(private messageService: MessageService, private productoService: ProductoService) { 
    this.listaVentasProductoStock=[];
  
  }

  ngOnInit(): void {
 
    this.obtenerHistorialProducto(this.nIProducto);
  }


  obtenerHistorialProducto(nId:number){

    

    this.productoService.historiaStockProducto(nId).subscribe(data=>{
      this.listaVentasProductoStock=data;

  })




}
}

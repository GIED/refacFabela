import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TwCotizacionProducto } from 'src/app/productos/model/TwCotizacionProducto';
import { VentasCotizacionesService } from 'src/app/shared/service/ventas-cotizaciones.service';

@Component({
  selector: 'app-cotizacion-producto',
  templateUrl: './cotizacion-producto.component.html',
  styleUrls: ['./cotizacion-producto.component.scss']
})
export class CotizacionProductoComponent implements OnInit {

  @Input() nIdCotizacion:number;
  listaProductoCortizacion:TwCotizacionProducto[];

  constructor(private messageService: MessageService, private ventasCotizacionesService: VentasCotizacionesService) { }

  ngOnInit(): void {

    this.consulta();

  }

  consulta(){
    console.log(this.nIdCotizacion);

    this.ventasCotizacionesService.obtenerCotizacionProducto(this.nIdCotizacion).subscribe(data=>{
      this.listaProductoCortizacion=data;
    })

  }

}

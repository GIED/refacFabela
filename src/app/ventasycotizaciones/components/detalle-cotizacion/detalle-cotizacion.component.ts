import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';

@Component({
  selector: 'app-detalle-cotizacion',
  templateUrl: './detalle-cotizacion.component.html',
  styleUrls: ['./detalle-cotizacion.component.scss']
})
export class DetalleCotizacionComponent implements OnInit {

  @Input() listaCotizaciones: TwCotizacion[];
  selectedProducts:TwCotizacion;
 

  constructor(private messageService:MessageService) { 
    this.listaCotizaciones=[];
  }

  ngOnInit(): void {
  }

  detalleCotizacion(twCotizacion: TwCotizacion){

    console.log(twCotizacion);

  }

}

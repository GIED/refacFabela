import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CotizacionDto } from '../../model/dto/CotizacionDto';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';

@Component({
  selector: 'app-consulta-cotizacion',
  templateUrl: './consulta-cotizacion.component.html',
  styleUrls: ['./consulta-cotizacion.component.scss']
})
export class ConsultaCotizacionComponent implements OnInit {
  @Input() listaCotizaciones: TwCotizacion[];
  selectedProducts:TwCotizacion;
 

  constructor(private messageService:MessageService) { 
    this.listaCotizaciones=[];
  }

  ngOnInit(): void {
  }

}

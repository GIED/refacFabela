import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/administracion/service/cliente.service';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { TcCliente } from '../../../administracion/model/TcCliente';


@Component({
  selector: 'app-consulta-cotizacion',
  templateUrl: './consulta-cotizacion.component.html',
  styleUrls: ['./consulta-cotizacion.component.scss']
})
export class ConsultaCotizacionComponent implements OnInit {

 

  //Estas son las variables que se tienen que quedar

  listaCotizaciones: TwCotizacion[];
  


  
constructor(private clienteService: ClienteService, private ventasCotizacionesService:VentasCotizacionesService) { 
    this.listaCotizaciones=[];
    
    
  }

ngOnInit(){

  this.ventasCotizacionesService.obtenerCotizaciones().subscribe(data => {
    this.listaCotizaciones=data;
    console.log(this.listaCotizaciones);
  }); 
}



cotizacionSelecionada(twCotizacion: TwCotizacion){
  

 
}




createId(): string {
  let id = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

}

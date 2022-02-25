import { Component, OnInit } from '@angular/core';
import { VentasInternetService } from '../../../shared/service/ventas-internet.service';
import { TwPagoComprobanteInternet } from '../../../ventasycotizaciones/model/TwPagoComprobanteInternet';

@Component({
  selector: 'app-valida-comprobante',
  templateUrl: './valida-comprobante.component.html',
  styleUrls: ['./valida-comprobante.component.scss']
})
export class ValidaComprobanteComponent implements OnInit {

  listaComprobantesInternet:TwPagoComprobanteInternet[];

  constructor(private ventasInternetService:VentasInternetService) { }

  ngOnInit(): void {
    this.ventasInternetService.consultaPagoComprobante(1).subscribe(respuesta =>{
      this.listaComprobantesInternet=respuesta;
    });
  }

}

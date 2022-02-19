import { Component, OnInit } from '@angular/core';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { TokenService } from '../../../shared/service/token.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-pago-venta-internet',
  templateUrl: './pago-venta-internet.component.html',
  styles: [
  ]
})
export class PagoVentaInternetComponent implements OnInit {

  listaCotizaciones: TwCotizacion[];
  cotizacion: TwCotizacion;
  mostrarFormCarga:boolean;

  constructor(private ventasCotizacionesService: VentasCotizacionesService, private tokenService: TokenService, private messageService: MessageService) {
    this.listaCotizaciones= [];
    this.mostrarFormCarga=false;
    this.cotizacion= new TwCotizacion();
   }

  ngOnInit(): void {

    let idUsuario = this.tokenService.getIdUser();

    this.ventasCotizacionesService.obtenerCotizacionDistribuidor(idUsuario).subscribe(data => {
      this.listaCotizaciones=data;
      console.log(this.listaCotizaciones);
    }); 

  }

  generarCotizacionPdf(idCotizacion:number){

 
    this.ventasCotizacionesService.generarCotizacionPdf(idCotizacion).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
        console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'cotizacion_' + idCotizacion + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Cotizacion Generada', life: 3000});
          
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar la Cotizacion', life: 3000});
        }
  
    });
  
  }

  muestraFormComprobante(twCotizacion: TwCotizacion){
    this.cotizacion=twCotizacion;
    this.mostrarFormCarga=true;

  }

}

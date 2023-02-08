import { Component, OnInit } from '@angular/core';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { TokenService } from '../../../shared/service/token.service';
import { MessageService } from 'primeng/api';
import { VentasInternetService } from '../../../shared/service/ventas-internet.service';
import { TwPagoComprobanteInternet } from '../../model/TwPagoComprobanteInternet';
import { findIndex } from 'rxjs/operators';

@Component({
  selector: 'app-pago-venta-internet',
  templateUrl: './pago-venta-internet.component.html',
  styles: [
  ]
})
export class PagoVentaInternetComponent implements OnInit {

  listaCotizaciones: TwPagoComprobanteInternet[];
  cotizacion: TwCotizacion;
  mostrarFormCarga:boolean;
  twPagoComprobanteInternet: TwPagoComprobanteInternet;

  constructor(
    private ventasCotizacionesService: VentasCotizacionesService, 
    private tokenService: TokenService, 
    private messageService: MessageService,
    private ventaInternetService: VentasInternetService) {
    this.listaCotizaciones= [];
    this.mostrarFormCarga=false;
    this.cotizacion= new TwCotizacion();
    this.twPagoComprobanteInternet = new TwPagoComprobanteInternet();
   }

  ngOnInit(): void {

    let idUsuario = this.tokenService.getIdUser();

    this.ventasCotizacionesService.obtenerCotizacionDistribuidor(idUsuario).subscribe(data => {
      this.listaCotizaciones=data;
      //console.log(this.listaCotizaciones);
    }); 

  }

  

  generarCotizacionPdf(idCotizacion:number){

 
    this.ventasCotizacionesService.generarCotizacionPdf(idCotizacion).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
        //console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'cotizacion_' + idCotizacion + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cotizacion Generada', life: 3000});
          
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar la Cotizacion', life: 3000});
        }
  
    });
  
  }

  muestraFormComprobante(twCotizacion: TwCotizacion){
    this.cotizacion=twCotizacion;
    this.mostrarFormCarga=true;

  }

  subirComprobante(comprobante: File){

    let formData = new FormData();
    formData.append("archivo", comprobante);
    formData.append("id", this.cotizacion.nId.toString());

    //console.log('formData: ',formData)

    this.ventaInternetService.guardaVenta(formData).subscribe(respuesta =>{
      this.twPagoComprobanteInternet=respuesta.twPagoComprobanteInternet;
      //console.log(this.twPagoComprobanteInternet);
      const index = this.listaCotizaciones.findIndex(t => t.nId == this.twPagoComprobanteInternet.nId);

      //console.log("index", index);

      this.listaCotizaciones[index]=this.twPagoComprobanteInternet;
      
      this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: respuesta.mensaje, life: 3000});
    	this.mostrarFormCarga=false;
    }, error=>{
      this.messageService.add({severity: 'error', summary: 'Correcto', detail: error.mensaje, life: 3000});
    })


  }

}

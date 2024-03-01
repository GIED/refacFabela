import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { VentasCotizacionesService } from 'src/app/shared/service/ventas-cotizaciones.service';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-cotizaciones-cliente-vigentes',
  templateUrl: './cotizaciones-cliente-vigentes.component.html',
  styleUrls: ['./cotizaciones-cliente-vigentes.component.scss']
})
export class CotizacionesClienteVigentesComponent implements OnInit {
  
  @Input() nICliente:number;
  @Output() cotizacionModifica: EventEmitter<number> = new EventEmitter();


  listaCotizacionesVigentes:TwCotizacion[];
  mostrarCotizacionProducto: boolean;
  nIdCotizacion:number;

  constructor( private messageService: MessageService, private ventasCotizacionesService: VentasCotizacionesService, private ventaService:VentasService ) { 


  }

  ngOnInit(): void {
    console.log('Esté es el dato que me ha llegado', this.nICliente)

    this.ventasCotizacionesService.obtenerCotizacionClienteVigente(this.nICliente).subscribe(data=>{
      this.listaCotizacionesVigentes=data;
     console.log(this.listaCotizacionesVigentes);
      
    })


  }

  generarVentaPdf(nId:number){

    this.ventaService.generarVentaPdf(nId).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
        //console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'venta_' + nId + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Comprobante de venta generado', life: 3000});
          //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
         
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
        }
  
    });

}

generarCotizacionPdf(twCotizacion: TwCotizacion){

  this.ventasCotizacionesService.generarCotizacionPdf(twCotizacion.nId).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'cotizacion_' + twCotizacion.nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cotizacion Generada', life: 3000});
        
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar la Cotizacion', life: 3000});
      }

  });

}

cotizacionProducto(nIdCotizacion:number){

  this.nIdCotizacion=nIdCotizacion;
  this.mostrarCotizacionProducto=true;

}


actualizaProducto(nIdCotizacion:number){

  this.cotizacionModifica.emit(nIdCotizacion);      


}
}

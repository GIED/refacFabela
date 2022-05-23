
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';


import { ProductoService } from 'src/app/shared/service/producto.service';
import { TvVentaStock } from '../../model/TvVentaStock';


@Component({
  selector: 'app-venta-stock-cero',
  templateUrl: './venta-stock-cero.component.html',
  styleUrls: ['./venta-stock-cero.component.scss']
})
export class VentaStockCeroComponent implements OnInit {
 
  calFechaFinal:Date;
  calFechaInicio:Date;
  defDateInicio:string;
  defDateFin:string;  
  date2:Date;
  fechaInicio:Date;
  fechaTermino:Date;
  listaVentaStock : TvVentaStock[];


  constructor(     
    private productosService: ProductoService,  
    private messageService: MessageService,
    private confirmationService: ConfirmationService,)
     { 
      


     }

  ngOnInit(): void {
  
   




  }

  obtenerVentaStock(fecha1:string, fecha2:string){

    this.productosService.obtenerVentaStock(fecha1, fecha2).subscribe(data=>{
      this.listaVentaStock=data;

      if(data.length==0){
        this.messageService.add({ severity: 'info', summary: 'Mensaje', detail: 'No se encontro información', life: 3000 });


      }
      console.log(data);
    
  
    });

  }

  consultar(){

    this.listaVentaStock=[];

   
   
    console.log(this.defDateInicio);
    console.log(this.defDateFin);

    if(this.fechaInicio!=null && this.fechaInicio != null ){
      this.defDateInicio = this.fechaInicio.getFullYear().toString()  + '-' + (this.fechaInicio.getMonth() + 1).toString().padStart(2, "0") + '-' + this.fechaInicio.getDate().toString().padStart(2, "0");
      this.defDateFin =  this.fechaTermino.getFullYear().toString() + '-' + (this.fechaTermino.getMonth() + 1).toString().padStart(2, "0") + '-' + this.fechaTermino.getDate().toString().padStart(2, "0") ;
  
      this.obtenerVentaStock(this.defDateInicio,this.defDateFin);
    }
    else{
  
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar fecha de inicio y fecha de termino', life: 3000 });
     
    }

    
  }

}

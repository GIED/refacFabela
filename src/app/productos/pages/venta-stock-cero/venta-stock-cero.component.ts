
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import * as moment from 'moment';


import { ProductoService } from 'src/app/shared/service/producto.service';


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



  constructor(     
    private productosService: ProductoService,  
    private messageService: MessageService,
    private confirmationService: ConfirmationService,)
     { 



     }

  ngOnInit(): void {
  
    
let now=moment('2022-05-15','YYYY-MM-DD');
console.log(now.format('YYYY-MM-YY'));



/*
    
    let calFechaFinal = moment("2013-02-08T09", "DD-MM-YYYY");
    this.calFechaInicio = moment("2022-05-13", "YYYY-MM-DD", true).toDate();
    
    console.log(moment(calFechaFinal, "YYYY-MM-DDTHH:mm:ss", true).toDate());

    
  
  


     this.defDateInicio = this.calFechaInicio.getFullYear().toString()  + '-' + (this.calFechaInicio.getMonth() + 1).toString().padStart(2, "0") + '-' + this.calFechaInicio.getDate().toString().padStart(2, "0");
     this.defDateFin =  this.calFechaFinal.getFullYear().toString() + '-' + (this.calFechaFinal.getMonth() + 1).toString().padStart(2, "0") + '-' + this.calFechaFinal.getDate().toString().padStart(2, "0") ;

     console.log(new Date(this.defDateInicio));
     console.log(new Date(this.defDateFin));
*/
   


  this.productosService.obtenerVentaStock(new Date(now.format('YYYY-MM-DD')),new Date(now.format('YYYY-MM-DD'))).subscribe(data=>{

    console.log(data);

  });


  }

}

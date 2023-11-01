import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TvVentaStock } from 'src/app/productos/model/TvVentaStock';
import { TwVentaProductoCancela } from 'src/app/productos/model/TwVentaProductoCancela';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-productos-cancelados',
  templateUrl: './productos-cancelados.component.html',
  styleUrls: ['./productos-cancelados.component.scss']
})
export class ProductosCanceladosComponent implements OnInit {
  calFechaFinal:Date;
  calFechaInicio:Date;
  defDateInicio:string;
  defDateFin:string;  
  date2:Date;
  fechaInicio:Date;
  fechaTermino:Date;
  listaProductosCanacelados : TwVentaProductoCancela[];
  cols: any[];


  constructor(
    private productosService: ProductoService,  
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ventasService:VentasService


  ) { 

    this.cols = [
      { field: 'twVenta.nId', header: 'venta' },
      { field: 'nIdProductos', header: 'Id Producto' },
      { field: 'tcProducto.sNoParte', header: 'No parte' },
      { field: 'tcProducto.sProducto', header: 'producto' },
      { field: 'nCantidad', header: 'cantidad' },
      { field: 'dFecha', header: 'fecha' },
      { field: 'tcUsuario.sNombreUsuario', header: 'usuario' },


  ]
  }

  ngOnInit(): void {
  }

  obtenerProductosCancelados(fecha1:string, fecha2:string){

    this.listaProductosCanacelados=null;

    this.productosService.obtenerVentasCancelaFecha(fecha1, fecha2).subscribe(data=>{
      this.listaProductosCanacelados=data;

      if(data.length==0){
        this.messageService.add({ severity: 'info', summary: 'Mensaje', detail: 'No se encontro información', life: 3000 });


      }
     // console.log( this.listaProductosCanacelados);
    
  
    });

  }

  consultar(){
   
    //console.log(this.defDateInicio);
    //console.log(this.defDateFin);

    if(this.fechaInicio!=null && this.fechaInicio != null ){
      this.defDateInicio = this.fechaInicio.getFullYear().toString()  + '-' + (this.fechaInicio.getMonth() + 1).toString().padStart(2, "0") + '-' + this.fechaInicio.getDate().toString().padStart(2, "0");
      this.defDateFin =  this.fechaTermino.getFullYear().toString() + '-' + (this.fechaTermino.getMonth() + 1).toString().padStart(2, "0") + '-' + this.fechaTermino.getDate().toString().padStart(2, "0") ;
  
      this.obtenerProductosCancelados(this.defDateInicio,this.defDateFin);
    }
    else{
  
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar fecha de inicio y fecha de termino', life: 3000 });
     
    }

    
  }

}

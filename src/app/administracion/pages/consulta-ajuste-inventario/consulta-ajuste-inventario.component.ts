import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TwAjusteInventario } from 'src/app/productos/model/TwAjusteInventario';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-consulta-ajuste-inventario',
  templateUrl: './consulta-ajuste-inventario.component.html',
  styleUrls: ['./consulta-ajuste-inventario.component.scss']
})
export class ConsultaAjusteInventarioComponent implements OnInit {


  calFechaFinal:Date;
  calFechaInicio:Date;
  defDateInicio:string;
  defDateFin:string;  
  date2:Date;
  fechaInicio:Date;
  fechaTermino:Date;
  cols: any[];
  bandera:Boolean;
  listaProductosAjustados:TwAjusteInventario[];
  constructor(
    private productosService: ProductoService,  
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private ventasService:VentasService
  ) {
    this.cols = [
      { field: 'nId', header: 'id' },
      { field: '.tcProducto.sNoParte', header: '.tcProducto.sNoParte' },
      { field: 'tcProducto.sProducto', header: 'tcProducto.sProducto' },
      { field: 'tcProducto.sMarca', header: 'tcProducto.sMarca' },
      { field: 'nCantidadAnterior', header: 'nCantidadAnterior' },
      { field: 'nCantidadActual', header: 'nCantidadActual' },
      { field: 'nTotalAjustado', header: 'nTotalAjustado' },
      { field: 'sFecha', header: 'sFecha' },
      { field: 'tcUsuario.sNombreUsuario', header: 'sNombreUsuario' },

  ]
  this.bandera=false;

  this.listaProductosAjustados=[];
   }

  ngOnInit(): void {
  }

  obtenerProductosAjustados(fecha1:string, fecha2:string){

    this.listaProductosAjustados=null;

    this.productosService.obtenerProductosAjustadosFecha(fecha1, fecha2).subscribe(data=>{
      this.listaProductosAjustados=data;

      if(this.listaProductosAjustados.length>0 || this.listaProductosAjustados!=undefined || this.listaProductosAjustados!=null ){

        this.bandera=true

      }
      else{
        this.bandera=false;
      }

      if(data.length==0){
        this.messageService.add({ severity: 'info', summary: 'Mensaje', detail: 'No se encontro información', life: 3000 });


      }
    //  console.log( this.listaProductosAjustados);
    
  
    });

  }

  consultar(){
   
    //console.log(this.defDateInicio);
    //console.log(this.defDateFin);
    this.bandera=false;

    if(this.fechaInicio!=null && this.fechaInicio != null ){
      this.defDateInicio = this.fechaInicio.getFullYear().toString()  + '-' + (this.fechaInicio.getMonth() + 1).toString().padStart(2, "0") + '-' + this.fechaInicio.getDate().toString().padStart(2, "0");
      this.defDateFin =  this.fechaTermino.getFullYear().toString() + '-' + (this.fechaTermino.getMonth() + 1).toString().padStart(2, "0") + '-' + this.fechaTermino.getDate().toString().padStart(2, "0") ;
  
      this.obtenerProductosAjustados(this.defDateInicio,this.defDateFin);
    }
    else{
  
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar fecha de inicio y fecha de termino', life: 3000 });
     
    }

    
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';
import { VwMetaProductoCompra } from '../../model/VwMetaProductoCompra';
import { ComprasService } from '../../../shared/service/compras.service';
import { MessageModule } from 'primeng/message';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-compras-producto',
  templateUrl: './compras-producto.component.html',
  styleUrls: ['./compras-producto.component.scss']
})
export class ComprasProductoComponent implements OnInit {
  datosRecibidos: { fechaInicio: string; fechaTermino: string } | null = null;
  listaProductosUltimaCompra:VwMetaProductoCompra[];
  vwMetaProductoCompra:VwMetaProductoCompra;
  dialogo:boolean;
  

  constructor(private comprasService:ComprasService,  private messageService: MessageService ) { 
    this.datosRecibidos=null;
    this.listaProductosUltimaCompra=[];
    this.vwMetaProductoCompra=new VwMetaProductoCompra();
    this.dialogo=false;
  }

  ngOnInit(): void {
   
    const today = new Date();
    this.getProductosUltimaFechaCompra(today.toISOString().split('T')[0], today.toISOString().split('T')[0])

  }

  cerrarFormulario(event:boolean){

    this.dialogo=false;

  }

  recibirFechas(fechas: { fechaInicio: string; fechaTermino: string }): void {
    this.datosRecibidos = fechas;

    if(this.datosRecibidos==null || this.datosRecibidos==undefined){
      const today = new Date();
     today.toISOString().split('T')[0]; 

     this.getProductosUltimaFechaCompra(today.toISOString().split('T')[0], today.toISOString().split('T')[0]);

    }
    else{
      console.log("voy a consultar ", this.datosRecibidos);
      this.getProductosUltimaFechaCompra( this.datosRecibidos.fechaInicio, this.datosRecibidos.fechaTermino);


    }
    
    console.log('Fechas recibidas:', this.datosRecibidos);
    console.log('Fechas recibidas:', this.datosRecibidos.fechaInicio);

  }

  getProductosUltimaFechaCompra(fechaInico:String, fechatermino:String){
   
    this.comprasService.obtenerProductosUltimaCompra(fechaInico,fechatermino).subscribe(data=>{
      this.listaProductosUltimaCompra=data;

     console.log(data);

    });

  }
  
  agregarProducto(producto:VwMetaProductoCompra){
    this.dialogo=true;
    this.vwMetaProductoCompra=producto;

    console.log( producto);
    

  }
 

}

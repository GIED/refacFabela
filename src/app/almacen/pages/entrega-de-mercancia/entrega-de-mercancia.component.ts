import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { VentaProductoDto } from 'src/app/ventasycotizaciones/model/dto/VentaProductoDto';

@Component({
  selector: 'app-entrega-de-mercancia',
  templateUrl: './entrega-de-mercancia.component.html',
  styleUrls: ['./entrega-de-mercancia.component.scss']
})
export class EntregaDeMercanciaComponent implements OnInit {

  productDialog: boolean;
    selectedProducts: Product[];
    selectedProducts2:VentaProductoDto;
    submitted: boolean;
    cols: any[];
    detalleDialog: boolean;   
    titulo:string;
    formaPago:any;
    usoCfdi:any;
    mostrarProductos:boolean;

    listaVentasDetalleCliente: TvVentasDetalle[];
    listaProductosVenta:VentaProductoDto;

    constructor(  private ventasService:VentasService) {

      this.cols = [
        { field: 'sFolioVenta', header: 'Folio' },
        { field: 'tcCliente.sRfc', header: 'RFC' },
        { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
        { field: 'nTotalVenta', header: 'Total Venta' },
        { field: 'dFechaVenta', header: 'Fecha de Venta' },
        { field: 'tcUsuario.sNombreUsuario', header: 'Vendedor' },
       
    ]
     }

     ngOnInit(){
      this.ventasService.obtenerVentaDetalleEntrega().subscribe(data=>{
      this.listaVentasDetalleCliente=data; 
      console.log(this.listaVentasDetalleCliente);      
     
     }); 
   }
  
 
 detalleVentaProductos(tvVentasDetalle:TvVentasDetalle){
 
   this.mostrarProductos=true;
 
   this.ventasService.obtenerProductoVentaId(tvVentasDetalle.nId).subscribe(data => {
       this.listaProductosVenta=data;
       console.log(this.listaProductosVenta);
   })
 
 }
 
 hideDialogAlter(){
   this.mostrarProductos=false;
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



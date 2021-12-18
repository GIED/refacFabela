import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from '../../../shared/service/ventas.service';
import { VentaProductoDto } from '../../model/dto/VentaProductoDto';

@Component({
  selector: 'app-consulta-venta',
  templateUrl: './consulta-venta.component.html',
  styleUrls: ['./consulta-venta.component.scss']
})
export class ConsultaVentaComponent implements OnInit {

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
     this.ventasService.obtenerVentaDetalle().subscribe(data=>{
     this.listaVentasDetalleCliente=data; 
     console.log(this.listaVentasDetalleCliente);      
    
    }); 
  }
 

detalleVentaProductos(tvVentasDetalle:TvVentasDetalle){

  this.mostrarProductos=true;

  this.ventasService.obtenerProductoVentaId(tvVentasDetalle.nId).subscribe(data => {
      this.listaProductosVenta=data;
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
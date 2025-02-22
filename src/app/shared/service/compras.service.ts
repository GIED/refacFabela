import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VwMetaProductoCompra } from 'src/app/productos/model/VwMetaProductoCompra';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { VenCotProdAnoDto } from 'src/app/productos/model/VenCotProdAnoDto';
import { TwCarritoCompraPedido } from 'src/app/productos/model/TwCarritoCompraPedido';
import { TwFacturaProveedorProducto } from './TwFacturaProveedorProducto';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http:HttpClient) { }


  obtenerProductosUltimaCompra(fechaInico:String, fechaTermino:String){
    let url= environment.servicios.apiRefacFabela + locator.consultaUltimaCompraProduc+'FechaIncio='+fechaInico+'&FechaTermino='+fechaTermino;
    return this.http.get<VwMetaProductoCompra[]>(url);
  }
  obtenerProductosVentaCotizacionIdProducto(idProducto:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaVantaCotizacionIdProducto+'idProducto='+idProducto;
    return this.http.get<VwMetaProductoCompra[]>(url);
  }

  obtenerVenCotProdAnoDto(idProducto:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaVenCotProdAnoDto+'idProducto='+idProducto;
    return this.http.get<VenCotProdAnoDto[]>(url);
  }

  obtenerCarritoCompra(idUsuario:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaCarritoPedido+'idUsuario='+idUsuario;
    return this.http.get<TwCarritoCompraPedido[]>(url);
  }
  guardaProductoCarritoPedido(twCarritoCompraPedido: TwCarritoCompraPedido){
    let url = environment.servicios.apiRefacFabela + locator.guardarProductoCarritoPedido;
    return this.http.post<TwCarritoCompraPedido>(url,twCarritoCompraPedido);
  }

  deteteCarritoCompraProducto(nIdProducto:number){
    let url= environment.servicios.apiRefacFabela + locator.deleteCarritoPedidoProducto+'nId='+nIdProducto;
    return this.http.get<boolean>(url);
  }

  
 saveProductoFactura(twFacturaProveedorProducto: TwFacturaProveedorProducto){
    let url = environment.servicios.apiRefacFabela + locator.saveFacturaProducto;
    return this.http.post<TwFacturaProveedorProducto>(url,twFacturaProveedorProducto);
  }
  





}

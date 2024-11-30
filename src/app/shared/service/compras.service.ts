import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VwMetaProductoCompra } from 'src/app/productos/model/VwMetaProductoCompra';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { VenCotProdAnoDto } from 'src/app/productos/model/VenCotProdAnoDto';

@Injectable({
  providedIn: 'root'
})
export class ComprasService {

  constructor(private http:HttpClient) { }


  obtenerProductosUltimaCompra(fechaInico:String, fechaTermino:String){
    let url= environment.servicios.apiRefacFabela + locator.consultaUltimaCompraProduc+'FechaIncio='+fechaInico+'&FechaTermino='+fechaTermino;
    return this.http.get<VwMetaProductoCompra[]>(url);
  }

  obtenerVenCotProdAnoDto(idProducto:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaVenCotProdAnoDto+'idProducto='+idProducto;
    return this.http.get<VenCotProdAnoDto[]>(url);
  }





}

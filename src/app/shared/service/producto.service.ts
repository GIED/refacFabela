import { TcProducto } from './../../productos/model/TcProducto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';
import { TcHistoriaPrecioProducto } from '../../productos/model/TcHistoriaPrecioProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  obtenerProductos(){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductos;
    return this.http.get<TcProducto[]>(url);
  }

  obtenerNoParte(noParte: string){
    let url = environment.servicios.apiRefacFabela + locator.consultaNoParte+'No_Parte='+noParte;
    return this.http.get<TcProducto[]>(url);
  }

  guardaProducto(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.guardarProducto;
    return this.http.post<TcProducto>(url,producto);
  }

  historiaPrecioProducto(nId: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerHistoriaPrecioProducto+'n_id='+nId;
    return this.http.get<TcHistoriaPrecioProducto[]>(url);
  }
  


}
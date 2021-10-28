import { TcProducto } from './../../productos/model/TcProducto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  obtenerNoParte(noParte: string){
    let url = environment.servicios.apiRefacFabela + locator.consultaNoParte+'No_Parte='+noParte;
    return this.http.get<TcProducto[]>(url);
  }

  guardaProducto(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.guardarProducto;
    return this.http.post<TcProducto>(url,producto);
  }


}

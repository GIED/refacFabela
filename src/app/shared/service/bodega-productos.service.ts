import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';
import { TwProductoBodega } from '../../productos/model/TwProductoBodega';

@Injectable({
  providedIn: 'root'
})
export class BodegaProductosService {

  constructor(private http:HttpClient) { }

  consultaInventario(bodega: number, anaquel:number, nivel:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaInventario+ 'idBodega='+bodega+'&idAnaquel='+anaquel+'&idNivel='+nivel;
    return this.http.get<TwProductoBodega[]>(url);
  }

}

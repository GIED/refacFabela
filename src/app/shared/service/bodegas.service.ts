import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';
import { TwProductoBodega } from '../../productos/model/TwProductoBodega';
import { TcBodega } from '../../productos/model/TcBodega';


@Injectable({
  providedIn: 'root'
})
export class BodegasService {

  constructor(private http: HttpClient) { }

    obtenerBodegas(){
      let url = environment.servicios.apiRefacFabela + locator.obtenerBodegas;
      return this.http.get<TcBodega[]>(url);
    }

    obtenerProductoBodegas(id: number){
      let url = environment.servicios.apiRefacFabela + locator.obtenerProductoBodegas+ 'id='+id;
      return this.http.get<TwProductoBodega[]>(url);
    }
    obtenerProductoBodega(id: number, nIdBodega){
      let url = environment.servicios.apiRefacFabela + locator.obtenerProductoBodega+ 'id='+id+'&idBodega='+nIdBodega;
      return this.http.get<TwProductoBodega>(url);
    }
}

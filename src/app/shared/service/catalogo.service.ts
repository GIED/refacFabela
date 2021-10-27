
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';
import { TcClavesat } from 'src/app/productos/model/TcClavesat';
import { Observable } from 'rxjs';
import { TcCategoriaGeneral } from '../../productos/model/TcCategoriaGeneral';
import { TcCategoria } from '../../productos/model/TcCategoria';
import { TcGanancia } from '../../productos/model/TcGanancia';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(private http:HttpClient) { }



  obtenerCategoriaGeneral(){
    let url= environment.servicios.apiRefacFabela + locator.consultaCategoriaGeneral;
    return this.http.get<TcCategoriaGeneral[]>(url);
  }

  obtenerCategoria(id:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaCategoria+'id='+ id;
    return this.http.get<TcCategoria[]>(url);
  }

  obtenerGanancia(){
    let url= environment.servicios.apiRefacFabela + locator.consultaGanancia;
    return this.http.get<TcGanancia[]>(url);
  }

  obtenerClaveSat(){
    let url= environment.servicios.apiRefacFabela + locator.consultaClaveSat;
    return this.http.get<TcClavesat[]>(url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TcNivel } from 'src/app/productos/model/TcNivel';

@Injectable({
  providedIn: 'root'
})
export class NivelService {

  constructor(private http: HttpClient) { }

  obtenerNivel(){
    let url = environment.servicios.apiRefacFabela + locator.obtenerNivel;
    return this.http.get<TcNivel[]>(url);
  }
}

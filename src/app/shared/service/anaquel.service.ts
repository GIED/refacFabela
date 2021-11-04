import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';

@Injectable({
  providedIn: 'root'
})
export class AnaquelService {

  constructor(private http :HttpClient) { }

  obtenerAnanquel(){
    let url = environment.servicios.apiRefacFabela + locator.obtenerAnaqueles;
    return this.http.get<TcAnaquel[]>(url);
  }
}

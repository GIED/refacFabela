import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TwProductoBodega } from '../../productos/model/TwProductoBodega';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

@Injectable({
  providedIn: 'root'
})
export class TraspasoService {

  constructor(private http:HttpClient) { }

  guardarMovimientoInterno(twProductoBodega:TwProductoBodega){
    let url = environment.servicios.apiRefacFabela + locator.movimientoInterno;
    return this.http.post<any>(url,twProductoBodega);
  }

  guardarMovimientoExterno(twProductoBodega:TwProductoBodega[]){
    let url = environment.servicios.apiRefacFabela + locator.movimientoExterno;
    return this.http.post<any>(url,twProductoBodega);
  }

}

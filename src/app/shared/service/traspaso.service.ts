import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TwProductoBodega } from '../../productos/model/TwProductoBodega';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TwAjusteInventario } from '../../productos/model/TwAjusteInventario';

@Injectable({
  providedIn: 'root'
})
export class TraspasoService {

  constructor(private http:HttpClient) { }

  guardarMovimientoInterno(twProductoBodega:TwProductoBodega){
    let url = environment.servicios.apiRefacFabela + locator.movimientoInterno;
    return this.http.post<any>(url,twProductoBodega);
  }

  guardarMovimientoInterno2(twProductoBodega:TwProductoBodega){
    let url = environment.servicios.apiRefacFabela + locator.movimientoInterno2;
    return this.http.post<any>(url,twProductoBodega);
  }

  guardarAjusteInventario(twAjusteInventario:TwAjusteInventario){
    let url = environment.servicios.apiRefacFabela + locator.guardarAjusteInventario;
    return this.http.post<any>(url,twAjusteInventario);
  }

  guardarMovimientoExterno(twProductoBodega:TwProductoBodega[]){
    let url = environment.servicios.apiRefacFabela + locator.movimientoExterno;
    return this.http.post<any>(url,twProductoBodega);
  }

}

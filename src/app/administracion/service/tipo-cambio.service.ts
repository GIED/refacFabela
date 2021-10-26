import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { locator } from '../../shared/sesion/locator';
import { TipoCambio } from '../interfaces/tipoCambio';

@Injectable({
  providedIn: 'root'
})
export class TipoCambioService {

  constructor(private http: HttpClient) { }

  obtenerTipoCambio(tipoCambio: TipoCambio){
    let url = environment.servicios.apiRefacFabela + locator.consultaTipoCambioId;
    return this.http.post<TipoCambio>(url , tipoCambio);
  }

  guardarTipoCambio(tipoCambio: TipoCambio){
    let url = environment.servicios.apiRefacFabela + locator.actualizarTipoCambio;
    return this.http.post<TipoCambio>(url , tipoCambio);
  }

  

}

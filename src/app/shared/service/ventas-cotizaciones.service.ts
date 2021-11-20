import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CotizacionDto } from '../../ventasycotizaciones/model/dto/CotizacionDto';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

@Injectable({
  providedIn: 'root'
})
export class VentasCotizacionesService {

  constructor(private http: HttpClient) { }

  guardaCotizacion(listaCotizacion: Array<CotizacionDto>){
    const httpOptions = {
      responseType: 'text' as 'json'
    };
    let url = environment.servicios.apiRefacFabela + locator.guardaCotizacion;
    return this.http.post<any>(url,listaCotizacion,httpOptions);
  }
  
}

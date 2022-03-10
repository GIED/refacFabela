import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TwPagoComprobanteInternet } from '../../ventasycotizaciones/model/TwPagoComprobanteInternet';

@Injectable({
  providedIn: 'root'
})
export class VentasInternetService {

  constructor(private http:HttpClient ) { }

  guardaRegistroCI(twPagoComprobanteInternet:TwPagoComprobanteInternet){    
    let url = environment.servicios.apiRefacFabela + locator.registraCotizacionInternet;
    return this.http.post<any>(url,twPagoComprobanteInternet);
  }

  guardaVenta(formData: FormData){    
    let url = environment.servicios.apiRefacFabela + locator.guardaComprobante;
    return this.http.post<any>(url,formData);
  }

  consultaPagoComprobante(estatus: number){
    let url = environment.servicios.apiRefacFabela +locator.consultaPagoComprobante+'status='+estatus;
    return this.http.get<TwPagoComprobanteInternet[]>(url);
  }

  actualizaEstatusComprobante(twPagoComprobanteInternet:TwPagoComprobanteInternet){    
    let url = environment.servicios.apiRefacFabela + locator.actualizarEstatusComprobante;
    return this.http.post<any>(url,twPagoComprobanteInternet);
  }

}

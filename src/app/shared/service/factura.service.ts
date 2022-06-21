import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TvVentasFactura } from '../../productos/model/TvVentasFactura';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }

  obtenerVentaFactura(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaFactura;
    return this.http.get<TvVentasFactura[]>(url);
  }

  facturarVenta(idVenta:number, cveCfdi:string){
    let url = environment.servicios.apiRefacFabela + locator.facturarVenta+ 'nIdVenta='+idVenta + '&cveCfdi='+cveCfdi;
    return this.http.get<any>(url);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TvVentasFactura } from '../../productos/model/TvVentasFactura';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }

  obtenerVentaFactura(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaFactura;
    return this.http.get<TvVentasFactura[]>(url);
  }
  consultaCreditos(){
    let url = environment.servicios.apiRefacFabela + locator.consultaCreditos;
    return this.http.get<number>(url);
  }
  obtenerFacturas(){
    let url = environment.servicios.apiRefacFabela + locator.consultaFacturas;
    return this.http.get<TvVentasFactura[]>(url);
  }

  facturarVenta(idVenta:number, cveCfdi:string){
    let url = environment.servicios.apiRefacFabela + locator.facturarVenta+ 'nIdVenta='+idVenta + '&cveCfdi='+cveCfdi;
    return this.http.get<any>(url);
  }
  facturarComplemento(idVenta:number, cveCfdi:string){
    let url = environment.servicios.apiRefacFabela + locator.facturarComplemento+ 'nIdVenta='+idVenta + '&cveCfdi='+cveCfdi;
    return this.http.get<any>(url);
  }

  descargarDocumento(nIdVenta: number, tipoDoc:string){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.descargarDocuemento + 'nIdVenta=' + nIdVenta+'&TipoDoc='+tipoDoc, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }
}

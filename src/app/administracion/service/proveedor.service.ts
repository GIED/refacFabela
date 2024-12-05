import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';

import { Proveedores } from '../interfaces/proveedores';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';
import { DataSerie } from 'src/app/productos/model/DataSerie';
import { TwFacturasProveedor } from '../../productos/model/TwFacturasProveedor';
import { BalanceFacturaProveedorMoneda } from 'src/app/productos/model/BalanceFacturaProveedorMoneda';
import { TwAbonoFacturaProveedor } from '../../productos/model/TwAbonoFacturaProveedor';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {

  constructor(
    private http: HttpClient
  ) { }
  getProveedores() {

    let url = environment.servicios.apiRefacFabela + locator.obtenerProveedores;
    return this.http.get<Proveedores[]>(url);
  }
  guardaProveedores(Proveedores:Proveedores){
    let url = environment.servicios.apiRefacFabela+locator.guardarProveedores;
    return this.http.post<Proveedores>(url,Proveedores);
  }

  getBalanceFacturasProveedores() {

    let url = environment.servicios.apiRefacFabela + locator.obtenerBalalcenProveedores;
    return this.http.get<VwFacturasBalanceProveedor[]>(url);
  }  

  getTipoCambioBM() {

    let url = environment.servicios.apiRefacFabela + locator.obtenertTipoCambioBM;
    return this.http.get<DataSerie>(url);
  }

  guardaFacturaProveedor(twFacturasProveedor: TwFacturasProveedor){
    let url = environment.servicios.apiRefacFabela+locator.guardarFacturaProveedor;
    return this.http.post<TwFacturasProveedor>(url,twFacturasProveedor);
  }

  getFacturasProveedorMoneda(vwFacturasBalanceProveedor:VwFacturasBalanceProveedor) {

    let url = environment.servicios.apiRefacFabela + locator.obtenerFacturasProveedorMoneda+'nIdProveedor='+vwFacturasBalanceProveedor.id.nIdProveedor+'&nIdMoneda='+vwFacturasBalanceProveedor.id.nIdMoneda;
    return this.http.get<VwFacturasBalanceProveedor[]>(url);
  }

  getFacturasProveedorMonedaBalance(vwFacturasBalanceProveedor:VwFacturasBalanceProveedor) {

    let url = environment.servicios.apiRefacFabela + locator.obtenerFacturasProveedorMonedaBalance+'nIdProveedor='+vwFacturasBalanceProveedor.id.nIdProveedor+'&nIdMoneda='+vwFacturasBalanceProveedor.id.nIdMoneda;
    return this.http.get<BalanceFacturaProveedorMoneda[]>(url);
  }
  getFacturasProveedorMonedaBalanceHistoria(nIdProveedor:number, nIdMoneda:number ) {

    let url = environment.servicios.apiRefacFabela + locator.obtenerFacturasProveedorMonedaBalanceHistoria+'nIdProveedor='+nIdProveedor+'&nIdMoneda='+nIdMoneda;
    return this.http.get<BalanceFacturaProveedorMoneda[]>(url);
  }

  getBalanceFactura(nIdFactura:number) {

    let url = environment.servicios.apiRefacFabela + locator.obtenerBalanceFactura+'nIdFactura='+nIdFactura;
    return this.http.get<BalanceFacturaProveedorMoneda>(url);
  }
  getFacturaProveedor(nIdFactura:number) {

    let url = environment.servicios.apiRefacFabela + locator.obtenerFacturaProveedor+'nIdFactura='+nIdFactura;
    return this.http.get<TwFacturasProveedor>(url);
  }

  getAbonosFacturaProveedor(nIdFactura:number) {

    let url = environment.servicios.apiRefacFabela + locator.obtenerAbonosFacturaProveedor+'nIdFactura='+nIdFactura;
    return this.http.get<TwAbonoFacturaProveedor[]>(url);
  }
  
  guardaAbonoFacturaProveedor(TwAbonoFacturaProveedor: TwAbonoFacturaProveedor){
    let url = environment.servicios.apiRefacFabela+locator.guardarAbonoFacturaProveedor;
    return this.http.post<TwAbonoFacturaProveedor>(url,TwAbonoFacturaProveedor);
  }
  getFacturasSinCobrar() {

    let url = environment.servicios.apiRefacFabela + locator.obtenertFacturasSinCobrar;
    return this.http.get<BalanceFacturaProveedorMoneda[]>(url);
  }


  getResults(query: string): Observable<any[]> {
    if (query.length < 3) {
      return of([]);
    }
    let url = environment.servicios.apiRefacFabela+ locator.obtenertProveedoresLike+'busqueda='+ query;
    return this.http.get<Proveedores[]>(url).pipe(
      map(response => response || [])
    );

  }
}

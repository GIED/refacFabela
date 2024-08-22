import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';

import { Proveedores } from '../interfaces/proveedores';
import { VwFacturasBalanceProveedor } from 'src/app/productos/model/VwFacturasBalanceProveedor';
import { DataSerie } from 'src/app/productos/model/DataSerie';
import { TwFacturasProveedor } from '../../productos/model/TwFacturasProveedor';

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


}

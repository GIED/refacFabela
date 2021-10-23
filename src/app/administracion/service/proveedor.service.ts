import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locator } from 'src/app/shared/sesion/locator';
import { environment } from 'src/environments/environment';

import { Proveedores } from '../interfaces/proveedores';

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
}

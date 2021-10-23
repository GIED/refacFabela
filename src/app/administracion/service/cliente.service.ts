import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from 'src/app/shared/sesion/locator';
import { Clientes } from '../interfaces/clientes';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(
    private http: HttpClient
  ) { }
  getClientes() {

    let url = environment.servicios.apiRefacFabela + locator.obtenerClientes;
    return this.http.get<Clientes[]>(url);
  }
  guardaCliente(cliente:Clientes){
    let url = environment.servicios.apiRefacFabela+locator.guardarClientes;
    return this.http.post<Clientes>(url,cliente);
  }
}

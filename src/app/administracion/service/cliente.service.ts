import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from 'src/app/shared/sesion/locator';
import { Clientes } from '../interfaces/clientes';
import { SaldoGeneralCliente } from '../../ventasycotizaciones/model/TvSaldoGeneralCliente';

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
  obtenerClientesLike(valor:string) {
    let url = environment.servicios.apiRefacFabela + locator.obtenerClienteLike+'clienteBuscar='+valor;
    return this.http.get<Clientes[]>(url);
  }
  obtenerSaldoGeneralCliente(id: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerSaldoGeneral+'id='+id;
    return this.http.get<SaldoGeneralCliente>(url);
  }
  guardaCliente(cliente:Clientes){
    let url = environment.servicios.apiRefacFabela+locator.guardarClientes;
    return this.http.post<Clientes>(url,cliente);
  }
  obtenerSaldosClientes(){
    let url = environment.servicios.apiRefacFabela + locator.consultaClientesSaldos;
    return this.http.get<SaldoGeneralCliente>(url);
  }
}

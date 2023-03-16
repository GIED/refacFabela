import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from 'src/app/shared/sesion/locator';
import { Clientes } from '../interfaces/clientes';
import { SaldoGeneralCliente } from '../../ventasycotizaciones/model/TvSaldoGeneralCliente';
import { TcCliente } from '../model/TcCliente';
import { TcRegimenFiscal } from 'src/app/productos/model/TcRegimenFiscal';

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
  consultaClienteId(id: number){
    let url = environment.servicios.apiRefacFabela + locator.consultaClienteId+'id='+id;
    return this.http.get<TcCliente>(url);
  }
  consultaClienteIdUsuario(idUsuario: number){
    let url = environment.servicios.apiRefacFabela + locator.consultaClienteIdUsuario+'id='+idUsuario;
    return this.http.get<TcCliente>(url);
  }
  consultaClienteRfc(rfc: String){
    let url = environment.servicios.apiRefacFabela + locator.consultaClienteRfc+'clienteBuscar='+rfc;
    return this.http.get<TcCliente>(url);
  }
  guardaCliente(cliente:Clientes){
    let url = environment.servicios.apiRefacFabela+locator.guardarClientes;
    return this.http.post<Clientes>(url,cliente);
  }
  obtenerSaldosClientes(){
    let url = environment.servicios.apiRefacFabela + locator.consultaClientesSaldos;
    return this.http.get<SaldoGeneralCliente>(url);
  }
  obtenerRegimenFiscal(){
    let url = environment.servicios.apiRefacFabela + locator.consultaRegimenFiscal;
    return this.http.get<TcRegimenFiscal[]>(url);
  }
}

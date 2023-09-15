
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';
import { TcClavesat } from 'src/app/productos/model/TcClavesat';
import { Observable } from 'rxjs';
import { TcCategoriaGeneral } from '../../productos/model/TcCategoriaGeneral';
import { TcCategoria } from '../../productos/model/TcCategoria';
import { TcGanancia } from '../../productos/model/TcGanancia';
import { TcFormaPago } from 'src/app/productos/model/TcFormaPago';
import { TwCaja } from '../../productos/model/TwCaja';
import { TcEstatusVenta } from '../../productos/model/TcEstatusVenta';
import { TcUsoCfdi } from '../../productos/model/TcUsoCfdi';
import { TcMarca } from 'src/app/productos/model/TcMarca';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  constructor(private http:HttpClient) { }



  obtenerCategoriaGeneral(){
    let url= environment.servicios.apiRefacFabela + locator.consultaCategoriaGeneral;
    return this.http.get<TcCategoriaGeneral[]>(url);
  }

  obtenerCategoria(id:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaCategoria+'id='+ id;
    return this.http.get<TcCategoria[]>(url);
  }

  obtenerGanancia(){
    let url= environment.servicios.apiRefacFabela + locator.consultaGanancia;
    return this.http.get<TcGanancia[]>(url);
  }

  obtenerGananciaId(nId: number){
    let url= environment.servicios.apiRefacFabela + locator.consultaGananciaId+'nId='+nId;
    return this.http.get<TcGanancia>(url);
  }

  obtenerClaveSat(){
    let url= environment.servicios.apiRefacFabela + locator.consultaClaveSat;
    return this.http.get<TcClavesat[]>(url);
  }
  obtenerFormaPago(){
    let url= environment.servicios.apiRefacFabela + locator.consultaFormaPago;
    return this.http.get<TcFormaPago[]>(url);
  }
  obtenerFormaPagoId(nId:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaFormaPagoId+'nId='+nId;
    return this.http.get<TcFormaPago>(url);
  }
  obtenerEstatusVentaId(nId:number){
    let url= environment.servicios.apiRefacFabela + locator.consultaEstatusVentaId+'nId='+nId;
    return this.http.get<TcEstatusVenta>(url);
  }
  obtenerUsoCfdi(){
    let url= environment.servicios.apiRefacFabela + locator.consultarUsoCfdi;
    return this.http.get<TcUsoCfdi[]>(url);
  }
  obtenerCajaActiva(){
    let url= environment.servicios.apiRefacFabela + locator.consultarCajaActiva;
    return this.http.get<TwCaja>(url);
  }
  obtenerCajas(){
    let url= environment.servicios.apiRefacFabela + locator.consultarCajas;
    return this.http.get<TwCaja[]>(url);
  }

  abrirCajaNueva(saldoInicial:number, nIdUsuario:number){
    let url= environment.servicios.apiRefacFabela + locator.abrirCajaNueva+'saldoInicial='+saldoInicial+'&nIdUsuario='+nIdUsuario;
    return this.http.get<TwCaja>(url);
  }
  obtenerMarcas(){
    let url= environment.servicios.apiRefacFabela + locator.consultarMarcas;
    return this.http.get<TcMarca[]>(url);
  }


  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { TwAbono } from 'src/app/productos/model/TwAbono';
import { DatosVenta } from 'src/app/ventasycotizaciones/interfaces/DatosVenta';
import { VentaProductoDto } from 'src/app/ventasycotizaciones/model/dto/VentaProductoDto';
import { TvVentaProductoMes } from 'src/app/productos/model/TvVentaProductoMes';
import { TwVenta } from '../../productos/model/TwVenta';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TrVentaCobro } from '../../productos/model/TrVentaCobro';
import { TwMaquinaCliente } from '../../productos/model/TwMaquinaCliente';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http :HttpClient) { }

  obtenerVentaDetalleTipoPago(nIdCliente:number, nTipoPago:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalleEstatus+'nIdCliente='+nIdCliente+'&nTipoPago='+nTipoPago;
    return this.http.get<TvVentasDetalle[]>(url);
  }
    obtenerVentaDetalleEstatusVenta(nEstatusVenta:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalleEstatusVenta+'nEstatusVenta='+nEstatusVenta;
    return this.http.get<TvVentasDetalle[]>(url);
  }
  obtenerVentaDetalle(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalle;
    return this.http.get<TvVentasDetalle[]>(url);
  }
  obtenerVentasLike(buscar: String){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentasLike+'buscar='+buscar;
    return this.http.get<TvVentasDetalle[]>(url);
  }
  obtenerVentasTop(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentasTop;
    return this.http.get<TvVentasDetalle[]>(url);
  }


  obtenerVentaDetalleCajaVigente(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalleCajaVigente;
    return this.http.get<TvVentasDetalle[]>(url);
  }
  obtenerVentaDetalleEntrega(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalleEntrega;
    return this.http.get<TvVentasDetalle[]>(url);
  }
  obtenerAbonosVentaId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaAbonoId+'nId='+id;
    return this.http.get<TwAbono[]>(url);
  }
  obtenerCobroParcial(id:number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerVentaCobroParcial+'nIdVenta='+id;
    return this.http.get<TrVentaCobro[]>(url);
  }
  
  obtenerProductoVentaId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentaId+'id='+id;
    return this.http.get<VentaProductoDto>(url);
  }
 cancelarVentaProducto(ventaProductoDto:VentaProductoDto){
    let url = environment.servicios.apiRefacFabela + locator.cancelaProductoVenta;
    return this.http.post<VentaProductoDto>(url,ventaProductoDto);
  }
  obtenerProductoVentaMesId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentaMesId+'id='+id;
    return this.http.get<TvVentaProductoMes[]>(url);
  }

  guardaVenta(datosVenta:DatosVenta){    
    let url = environment.servicios.apiRefacFabela + locator.guardaVenta;
    return this.http.post<TwVenta>(url,datosVenta);
  }
  guardaVentaDetalle(tvVentasDetalle:TvVentasDetalle){    
    let url = environment.servicios.apiRefacFabela + locator.guardaVentaDetalle;
    return this.http.post<TvVentasDetalle>(url,tvVentasDetalle);
  }

  guardaVentaProductoId(ventaProductoDto:VentaProductoDto){
    let url = environment.servicios.apiRefacFabela + locator.guardaVentaProductoId;
    return this.http.post<any>(url,ventaProductoDto);
  }

  guardaVentaProductoEntregaId(ventaProductoDto:VentaProductoDto){
    const httpOptions = {
      responseType: 'text' as 'json'
    };
    let url = environment.servicios.apiRefacFabela + locator.guardaVentaProductoEntrega;
    return this.http.post<any>(url,ventaProductoDto,httpOptions);
  }

  generarVentaPdf(nIdVenta: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarVentaPdf + 'nIdVenta=' + nIdVenta, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  generarVentaAlmacenPdf(nIdVenta: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarVentaAlmacenPdf + 'nIdVenta=' + nIdVenta, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  generarBalanceCajaPdf(nIdCaja: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarReporteCajaPdf + 'nIdCaja=' + nIdCaja, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }
  generarVentaPedidoPdf(nIdVentaPedido: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarVentaPedidoPdf + 'nIdVentaPedido=' + nIdVentaPedido, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }


  generarAbonoVentaPdf(nIdVenta: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarAbonoVentaPdf + 'nIdVenta=' + nIdVenta, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }
  generarHistorialAbonoVentaPdf(nIdCliente: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarHistorialAbonoVentaPdf + 'nIdCliente=' + nIdCliente, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  obtnerVentaId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultarVentaId+'nIdVenta='+id;
    return this.http.get<any>(url);
  }
  obtenerMaquinasCliente(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultarMaquinaCliente+'nIdCliente='+id;
    return this.http.get<TwMaquinaCliente[]>(url);
  }

  guardaAbono(twAbono:TwAbono){
    let url = environment.servicios.apiRefacFabela + locator.guardaAbono;
    return this.http.post<any>(url,twAbono);
  }
  guardarMaquina(twMaquinaCliente:TwMaquinaCliente){
    let url = environment.servicios.apiRefacFabela + locator.guardarMaquina;
    return this.http.post<any>(url,twMaquinaCliente);
  }


}
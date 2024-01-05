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
import { TwVentasProductosTraer } from '../../productos/model/TwVentasProductosTraer';
import { VwSaldoVentaFavorDisponible } from 'src/app/productos/model/VwSaldoVentaFavorDisponible';
import { VentaProductoCancelaDto } from 'src/app/ventasycotizaciones/model/dto/VentaProductoCancelaDto';
import { TwVentasProducto } from 'src/app/productos/model/TwVentasProducto';
import { CalculaPrecioDto } from 'src/app/productos/model/CalculaPrecioDto';
import { TvReporteDetalleVenta } from 'src/app/productos/model/TvReporteDetalleVenta';
import { TwSaldoUtilizado } from '../../productos/model/TwSaldoUtilizado';

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

  obtenerSaldoVentaFavor(nIdVenta:number){
    let url = environment.servicios.apiRefacFabela + locator.consultarVentaSaldo+'nIdVenta='+nIdVenta;
    return this.http.get<VwSaldoVentaFavorDisponible>(url);
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

  obtenerVentaCaja(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentasCaja+'nId='+id;
    return this.http.get<TvReporteDetalleVenta[]>(url);
  }
  obtenerCobroParcial(id:number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerVentaCobroParcial+'nIdVenta='+id;
    return this.http.get<TrVentaCobro[]>(url);
  }
  
  obtenerProductoVentaId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentaId+'id='+id;
    return this.http.get<VentaProductoDto>(url);
  }

  obtenerProductosVentaTraer(nId:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentasTraer+'nIdVenta='+nId;
    return this.http.get<TwVentasProductosTraer[]>(url);
  }
 cancelarVentaProducto(ventaProductoCancelaDto:VentaProductoCancelaDto){
    let url = environment.servicios.apiRefacFabela + locator.cancelaProductoVenta;
    return this.http.post<VentaProductoDto>(url,ventaProductoCancelaDto);
  }
  obtenerProductoVentaMesId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentaMesId+'id='+id;
    return this.http.get<TvVentaProductoMes[]>(url);
  }
  obtenerProductoVenta(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVenta+'id='+id;
    return this.http.get<TwVentasProducto[]>(url);
  }

  obtenerVentaProductoId(idVenta:number, idProducto:number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerVentaProductoId+'nIdVenta='+idVenta+'&nIdProducto='+idProducto;
    return this.http.get<TwVentasProducto>(url);
  }

  calcularNuevoPrecioAjustado(calculaPrecioDto:CalculaPrecioDto){    
    let url = environment.servicios.apiRefacFabela + locator.calcularNuevoPrecioAjustado;
    return this.http.post<CalculaPrecioDto>(url,calculaPrecioDto);
  }

  actualizaVentaProducto(twVentasProducto:TwVentasProducto){    
    let url = environment.servicios.apiRefacFabela + locator.actualizaVentaProducto;
    return this.http.post<TwVentasProducto>(url,twVentasProducto);
  }

  guardaVenta(datosVenta:DatosVenta){    
    let url = environment.servicios.apiRefacFabela + locator.guardaVenta;
    return this.http.post<TwVenta>(url,datosVenta);
  }
  guardaVentaDetalle(tvVentasDetalle:TvVentasDetalle){    
    let url = environment.servicios.apiRefacFabela + locator.guardaVentaDetalle;
    return this.http.post<TvVentasDetalle>(url,tvVentasDetalle);
  }
  guardarVentaDescuento(tvVentasDetalle:TvVentasDetalle){    
    let url = environment.servicios.apiRefacFabela + locator.guardarVentaDescuento;
    return this.http.post<TvVentasDetalle>(url,tvVentasDetalle);
  }
  consultaVentaDetalleId(nIdVenta:number){    
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalleId+'nIdVenta='+nIdVenta;
    return this.http.get<TvVentasDetalle>(url);
  }
  guardaSaldoUtilizado(twSaldoUtilizado:TwSaldoUtilizado){
    let url = environment.servicios.apiRefacFabela + locator.guardaSaldoUtilizado;
    return this.http.post<TwSaldoUtilizado>(url,twSaldoUtilizado);
  }

  guardaVentaCobro(trVentaCobro:TrVentaCobro){
    let url = environment.servicios.apiRefacFabela + locator.guardaVentaCobro;
    return this.http.post<TrVentaCobro>(url,trVentaCobro);
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

  generarSaldoFavorPdf(nIdVenta: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarSaldoFavorPdf + 'nIdVenta=' + nIdVenta, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  generarInventarioPdf(bodega:number, nivel:number, anaquel:number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarInventarioPdf + 'nIdBodega=' + bodega+"&nIdNivel="+nivel+"&nIdAnaquel="+anaquel, httpOptions).pipe(
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
    return this.http.get<TwVenta>(url);
  }
  obtenerMaquinasCliente(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultarMaquinaCliente+'nIdCliente='+id;
    return this.http.get<TwMaquinaCliente[]>(url);
  }

  guardaAbono(twAbono:TwAbono){
    let url = environment.servicios.apiRefacFabela + locator.guardaAbono;
    return this.http.post<any>(url,twAbono);
  }

  guardarVentaCompleta(twVenta:TwVenta){
    let url = environment.servicios.apiRefacFabela + locator.guardarVentaCompleta;
    return this.http.post<TwVenta>(url,twVenta);
  }
  guardarMaquina(twMaquinaCliente:TwMaquinaCliente){
    let url = environment.servicios.apiRefacFabela + locator.guardarMaquina;
    return this.http.post<any>(url,twMaquinaCliente);
  }

  cambiarVentaACredito(twVenta: TwVenta){
    let url = environment.servicios.apiRefacFabela + locator.cambiarVentaACredito;
    return this.http.post<any>(url,twVenta);
  }


}
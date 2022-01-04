import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { TwAbono } from 'src/app/productos/model/TwAbono';
import { DatosVenta } from 'src/app/ventasycotizaciones/interfaces/DatosVenta';
import { VentaProductoDto } from 'src/app/ventasycotizaciones/model/dto/VentaProductoDto';
import { TvVentaProductoMes } from 'src/app/productos/model/TvVentaProductoMes';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  constructor(private http :HttpClient) { }

  obtenerVentaDetalleTipoPago(nIdCliente:number, nTipoPago:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalleEstatus+'nIdCliente='+nIdCliente+'&nTipoPago='+nTipoPago;
    return this.http.get<TvVentasDetalle[]>(url);
  }
  obtenerVentaDetalle(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaDetalle;
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
  
  obtenerProductoVentaId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentaId+'id='+id;
    return this.http.get<VentaProductoDto>(url);
  }
  obtenerProductoVentaMesId(id:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaProductoVentaMesId+'id='+id;
    return this.http.get<TvVentaProductoMes[]>(url);
  }

  guardaVenta(datosVenta:DatosVenta){
    const httpOptions = {
      responseType: 'text' as 'json'
   };
    let url = environment.servicios.apiRefacFabela + locator.guardaVenta;
    return this.http.post<any>(url,datosVenta, httpOptions);
  }

  guardaVentaProductoId(ventaProductoDto:VentaProductoDto){
    let url = environment.servicios.apiRefacFabela + locator.guardaVentaProductoId;
    return this.http.post<any>(url,ventaProductoDto);
  }


}
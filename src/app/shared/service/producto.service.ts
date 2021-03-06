import { TcProducto } from './../../productos/model/TcProducto';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { locator } from '../sesion/locator';
import { TcHistoriaPrecioProducto } from '../../productos/model/TcHistoriaPrecioProducto';
import { TwProductoAlternativo } from 'src/app/productos/model/TwProductoAlternativo';
import { TvStockProducto } from '../../productos/model/TvStockProducto';
import { TwHistoriaIngresoProducto } from 'src/app/productos/model/TwHistoriaIngresoProducto';
import { TvVentaStock } from '../../productos/model/TvVentaStock';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  obtenerProductos(){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductos;
    return this.http.get<TcProducto[]>(url);
  }
  obtenerProductosLike(producto:string){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductosLike +'producto='+producto;
    return this.http.get<TcProducto[]>(url);
  }

  obtenerTotalBodegasIdProducto(nId:number){
    let url =environment.servicios.apiRefacFabela + locator.obtenerTotalBodegasIdProducto+'id='+nId;
    console.log(url);
    return this.http.get<TvStockProducto>(url);
  }
  
  obtenerVentaStock(fechaInicio: string, fechaFinal:string){
    let url =environment.servicios.apiRefacFabela + locator.obtenerVentaStockFecha+'dFechaInicio='+fechaInicio+'&dFechaFinal='+fechaFinal;
    console.log(url);
    return this.http.get<TvVentaStock[]>(url);
  }

  obtenerProductosAlternativos(nId:number){
    let url =environment.servicios.apiRefacFabela + locator.obtenerProductosalternativosId+'nId='+nId;
    return this.http.get<TwProductoAlternativo[]>(url);
  }

  obtenerNoParte(noParte: string){
    let url = environment.servicios.apiRefacFabela + locator.consultaNoParte+'No_Parte='+noParte;
    return this.http.get<TcProducto[]>(url);
  }

  guardaProducto(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.guardarProducto;
    return this.http.post<TcProducto>(url,producto);
  }

  calcularPrecioProducto(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.calcularPrecioProducto;
    return this.http.post<TcProducto>(url,producto);
  }

  historiaPrecioProducto(nId: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerHistoriaPrecioProducto+'n_id='+nId;
    return this.http.get<TcHistoriaPrecioProducto[]>(url);
  }

  historiaIngresoProducto(nId: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerHistoriaIngresoProducto+'n_id='+nId;
    return this.http.get<TwHistoriaIngresoProducto[]>(url);
  }

  simuladorPrecioProducto(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.obtenerSimuladorPrecioProducto;
    return this.http.post<TcProducto>(url,producto);
  }

  guardaProductoAlternativo(productoAlternativo: TwProductoAlternativo){
    let url = environment.servicios.apiRefacFabela + locator.guardarProductoAlternativo;
    return this.http.post<TwProductoAlternativo>(url,productoAlternativo);
  }
  


}

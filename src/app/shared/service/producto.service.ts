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
import { TvStockProductoHist } from 'src/app/productos/model/TvStrockProductoHist';
import { TwProductoCancela } from 'src/app/productos/model/TwProductoCancela';
import { ProductoDescuentoDto } from 'src/app/productos/model/ProductoDescuentoDto';
import { TwVentaProductoCancela } from 'src/app/productos/model/TwVentaProductoCancela';
import { TwAjusteInventario } from 'src/app/productos/model/TwAjusteInventario';
import { TwFacturaProveedorProducto } from './TwFacturaProveedorProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  obtenerProductos(){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductos;
    return this.http.get<TcProducto[]>(url);
  }
  obtenerProductoId(nId:number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductoId+'nId='+nId;
    return this.http.get<TcProducto[]>(url);
  }
  obtenerProductoBeanId(nId:number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductoBeanId+'nId='+nId;
    return this.http.get<TcProducto>(url);
  }
  
  obtenerProductosLike(producto:string){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductosLike +'producto='+producto;
    return this.http.get<TcProducto[]>(url);
  }

  obtenerTotalBodegasIdProducto(nId:number){
    let url =environment.servicios.apiRefacFabela + locator.obtenerTotalBodegasIdProducto+'id='+nId;
  
    return this.http.get<TvStockProducto>(url);
  }
  
  obtenerVentaStock(fechaInicio: string, fechaFinal:string){
    let url =environment.servicios.apiRefacFabela + locator.obtenerVentaStockFecha+'dFechaInicio='+fechaInicio+'&dFechaFinal='+fechaFinal;
  
    return this.http.get<TvVentaStock[]>(url);
  }
  obtenerVentasCancelaFecha(fechaInicio: string, fechaFinal:string){
    let url =environment.servicios.apiRefacFabela + locator.obtenerVentasCancelaFecha+'fechaInicio='+fechaInicio+'&fechaTermino='+fechaFinal;
  
    return this.http.get<TwVentaProductoCancela[]>(url);
  }
  obtenerProductosAjustadosFecha(fechaInicio: string, fechaFinal:string){
    let url =environment.servicios.apiRefacFabela + locator.obtenerProductosAjustadosFecha+'fechaInicio='+fechaInicio+'&fechaTermino='+fechaFinal;
  
    return this.http.get<TwAjusteInventario[]>(url);
  }

  obtenerProductosAlternativos(nId:number){
    let url =environment.servicios.apiRefacFabela + locator.obtenerProductosalternativosId+'nId='+nId;
    return this.http.get<TwProductoAlternativo[]>(url);
  }
  obtenerProductosAlternativosDescuento(nId:number, nIdCliente:number){
    let url =environment.servicios.apiRefacFabela + locator.obtenerProductosalternativosIdDescuento+'nId='+nId+'&nIdCliente='+nIdCliente;
    return this.http.get<TwProductoAlternativo[]>(url);
  }

  obtenerNoParte(noParte: string){
    let url = environment.servicios.apiRefacFabela + locator.consultaNoParte+'No_Parte='+noParte;
    return this.http.get<TcProducto[]>(url);
  }
  obtenerProductoNoParte(noParte: string){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductosNoParte+'No_Parte='+noParte;
    return this.http.get<TcProducto>(url);
  }

  guardaProducto(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.guardarProducto;
    return this.http.post<TcProducto>(url,producto);
  }
  guardaProductoGeneral(producto: TcProducto){
    let url = environment.servicios.apiRefacFabela + locator.guardarProductoGeneral;
    return this.http.post<TcProducto>(url,producto);
  }

  calcularPrecioProducto(productoDescuentoDto: ProductoDescuentoDto ){
    let url = environment.servicios.apiRefacFabela + locator.calcularPrecioProducto;
    return this.http.post<TcProducto>(url,productoDescuentoDto);
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

  historiaStockProducto(nId: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerHistorialStockProducto+'id='+nId;
    return this.http.get<TvStockProductoHist[]>(url);
  }
  productosCanceladosId(nId: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerProductosCaneladosId+'id='+nId;
    return this.http.get<TwProductoCancela[]>(url);
  }

  getProductosFacturaId(nId: number){
    let url = environment.servicios.apiRefacFabela + locator.getProductosFacturaId+'nIdFactura='+nId;
    return this.http.get<TwFacturaProveedorProducto[]>(url);
  }
  


}

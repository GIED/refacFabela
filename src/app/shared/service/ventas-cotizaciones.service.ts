import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CotizacionDto } from '../../ventasycotizaciones/model/dto/CotizacionDto';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TwCotizacion } from '../../productos/model/TcCotizacion';
import { TvStockProducto } from '../../productos/model/TvStockProducto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TwPagoComprobanteInternet } from '../../ventasycotizaciones/model/TwPagoComprobanteInternet';
import { TwVenta } from '../../productos/model/TwVenta';
import { TwCotizacionProducto } from 'src/app/productos/model/TwCotizacionProducto';

@Injectable({
  providedIn: 'root'
})
export class VentasCotizacionesService {

  constructor(private http: HttpClient) { }

  guardaCotizacion(listaCotizacion: Array<CotizacionDto>){
    let url = environment.servicios.apiRefacFabela + locator.guardaCotizacion;
    return this.http.post<TwCotizacion>(url,listaCotizacion);
  }

  obtenerCotizaciones(){   
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizaciones;
    return this.http.get<TwCotizacion[]>(url);
  }

  obtenerCotizacionProductoCliente(nIdCliente:number, nIdProducto:number){   
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizacionClienteProducto+'nIdCliente='+nIdCliente+'&nIdProducto='+nIdProducto;
    return this.http.get<TwCotizacionProducto[]>(url);
  }

  obtenerCotizacionProducto(nIdCotizacion:number){   
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizacionIdCotizacion+'id='+nIdCotizacion;
    return this.http.get<TwCotizacionProducto[]>(url);
  }

  obtenerCotizacionClienteVigente(nIdCliente:number){   
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizacionesIdClienteVigente+'nIdCliente='+nIdCliente;
    return this.http.get<TwCotizacion[]>(url);
  }


  obtenerCotizacionesBusqueda(busqueda:string){   
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizacionesBusqueda+'buscar='+busqueda;
    return this.http.get<TwCotizacion[]>(url);
  }

  obtenerCotizacionDistribuidor(idUsuario: number){   
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizacionDistribuidor + 'idUsuario='+idUsuario;
    return this.http.get<TwPagoComprobanteInternet[]>(url);
  }

  obtenerCotizacionId(id: number){
    let url = environment.servicios.apiRefacFabela + locator.consultaCotizacionId+'id='+id;
    return this.http.get<TvStockProducto[]>(url);
  }
  obtenerVentaIdCotizacion(id: number){
    let url = environment.servicios.apiRefacFabela + locator.obtenerVentaIdcotizacon+'nIdCotizacion='+id;
    return this.http.get<TwVenta>(url);
  }

  generarCotizacionPdf(nIdCotizacion: number){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarCotizacionPdf + 'nIdCotizacion=' + nIdCotizacion, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  
  
}

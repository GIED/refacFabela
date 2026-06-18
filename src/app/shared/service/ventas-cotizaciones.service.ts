import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CotizacionDto } from '../../ventasycotizaciones/model/dto/CotizacionDto';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TwCotizacion } from '../../productos/model/TcCotizacion';
import { TvStockProducto } from '../../productos/model/TvStockProducto';
import { catchError, map, tap } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TwPagoComprobanteInternet } from '../../ventasycotizaciones/model/TwPagoComprobanteInternet';
import { TwVenta } from '../../productos/model/TwVenta';
import { TwCotizacionProducto } from 'src/app/productos/model/TwCotizacionProducto';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class VentasCotizacionesService {

  constructor(private http: HttpClient, private messageService: MessageService) { }

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

  obtenerHistorialCotizacionesCliente(nIdCliente: number, nMeses?: number){
    let url = environment.servicios.apiRefacFabela + locator.consultaHistorialCotizacionesCliente + 'nIdCliente=' + nIdCliente;
    if (nMeses != null) {
      url += '&nMeses=' + nMeses;
    }
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
    const url = environment.servicios.apiRefacFabela + locator.generarCotizacionPdf + 'nIdCotizacion=' + nIdCotizacion;
    return this.http.get(url, {
      responseType: 'arraybuffer',
      observe: 'response'
    }).pipe(
      tap(response => {
        const aviso = response.headers.get('X-Aviso-Correo');
        if (aviso) {
          this.messageService.add({ severity: 'warn', summary: 'Correo no enviado', detail: aviso, life: 6000 });
        }
      }),
      map(response => response.body),
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  
  
}

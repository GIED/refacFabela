import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

import { TwPedidoProducto } from 'src/app/productos/model/TwPedidoProducto';
import { TvPedidoDetalle } from 'src/app/productos/model/TvPedidoDetalle';
import { PedidoDto } from '../../productos/model/PedidoDto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {

    constructor(private http :HttpClient) { }
  
    obtenerProductosPedido(nEstatus:number){
      let url = environment.servicios.apiRefacFabela + locator.obtenerProductosPedido+"nIdPedido="+nEstatus;
      return this.http.get<TwPedidoProducto[]>(url);
    }

    borrarProductoPedido(twPedidoProducto:TwPedidoProducto){
      let url = environment.servicios.apiRefacFabela + locator.borrarProductoPedido;
      return this.http.post<any>(url,twPedidoProducto);
    }
    obtenerPedidosDetalleEstatus(nEstatus:number){
        let url = environment.servicios.apiRefacFabela + locator.obtenerPedidosEstatus+"nEstatus="+nEstatus;
        return this.http.get<TvPedidoDetalle[]>(url);
      }

      guardaPedido(pedidoDto:PedidoDto){
        let url = environment.servicios.apiRefacFabela + locator.guardaPedido;
        return this.http.post<any>(url,pedidoDto);
      }
      guardaIngresoProductoPedido(twPedidoProducto:TwPedidoProducto){
        let url = environment.servicios.apiRefacFabela + locator.guardaIngresoProductoPedido;
        return this.http.post<any>(url,twPedidoProducto);
      }

      generarPedidoPdf(nId: number){
        const httpOptions = {
          responseType: 'arraybuffer' as 'json'
        };
        return this.http.get<any>(environment.servicios.apiRefacFabela + locator.generarPedidoPdf + 'nIdPedido=' + nId, httpOptions).pipe(
          catchError(e => {
            console.error(e);
            return throwError(e);
          })
        );
    
      }


  }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';

import { TwPedidoProducto } from 'src/app/productos/model/TwPedidoProducto';
import { TvPedidoDetalle } from 'src/app/productos/model/TvPedidoDetalle';
import { PedidoDto } from '../../productos/model/PedidoDto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TwPedido } from 'src/app/productos/model/TwPedido';
import { TwCarritoCompraPedido } from 'src/app/productos/model/TwCarritoCompraPedido';


@Injectable({
  providedIn: 'root'
})
export class PedidosService {

    constructor(private http :HttpClient) { }
  
    obtenerProductosPedido(nEstatus:number){
      let url = environment.servicios.apiRefacFabela + locator.obtenerProductosPedido+"nIdPedido="+nEstatus;
      return this.http.get<TwPedidoProducto[]>(url);
    }

    obtenerProductosIdPedido(nIdProducto:number){
      let url = environment.servicios.apiRefacFabela + locator.obtenerProductosIdPedido+"nIdProducto="+nIdProducto;
      return this.http.get<TwPedidoProducto[]>(url);
    }

    borrarProductoPedido(twPedidoProducto:TwPedidoProducto){
      let url = environment.servicios.apiRefacFabela + locator.borrarProductoPedido;
      return this.http.post<any>(url,twPedidoProducto);
    }
    borrarProductoPedidoId(id:number){
      let url = environment.servicios.apiRefacFabela + locator.borrarPedidoProductoId+'nId='+id;
      return this.http.get<boolean>(url);
    }

    borrarPedidoCarritoId(id:number){
      let url = environment.servicios.apiRefacFabela + locator.borrarPedidoCarritoId+'nId='+id;
      return this.http.get<boolean>(url);
    }

    borrarProductosCarritoUsuario(idUsuario:number){
      let url = environment.servicios.apiRefacFabela + locator.borrarTodosProductosCarrito+'nIdUsuario='+idUsuario;
      return this.http.get<boolean>(url);
    }


    obtenerPedidosDetalleEstatus(nEstatus:number){
        let url = environment.servicios.apiRefacFabela + locator.obtenerPedidosEstatus+"nEstatus="+nEstatus;
        return this.http.get<TvPedidoDetalle[]>(url);
      }
      obtenerPedidosDetalle(){
        let url = environment.servicios.apiRefacFabela + locator.obtenerPedidos;
        return this.http.get<TvPedidoDetalle[]>(url);
      }

      obtenerProductosCarritoUsuario(idUsuario:number){
        let url = environment.servicios.apiRefacFabela + locator.obteneCarritoPedidoUsuario+"nIdUsuario="+idUsuario;
        return this.http.get<TwPedidoProducto[]>(url);
      }
      obtenerProductosComprasUsuario(idUsuario:number){
        let url = environment.servicios.apiRefacFabela + locator.obteneCarritoComprasUsuario+"nIdUsuario="+idUsuario;
        return this.http.get<TwCarritoCompraPedido[]>(url);
      }
      obtenerPedidosId(nIdPedido:number){
        let url = environment.servicios.apiRefacFabela + locator.obtenerPedidosId+"nIdPedido="+nIdPedido;
        return this.http.get<TwPedido>(url);
      }

      guardaPedido(pedidoDto:PedidoDto){
        let url = environment.servicios.apiRefacFabela + locator.guardaPedido;
        return this.http.post<any>(url,pedidoDto);
      }
      guardaPedidoGeneral(twPedido:TwPedido){
        let url = environment.servicios.apiRefacFabela + locator.guardaPedidoGeneral;
        return this.http.post<TwPedido>(url,twPedido);
      }
      guardaPedidoProducto(twPedidoProducto:TwPedidoProducto){
        let url = environment.servicios.apiRefacFabela + locator.guardaPedidoProducto;
        return this.http.post<TwPedidoProducto>(url,twPedidoProducto);
      }

       guardaProductoCarrito(twCarritoCompraPedido:TwCarritoCompraPedido){
        let url = environment.servicios.apiRefacFabela + locator.guardaProductoCarrito;
        return this.http.post<TwCarritoCompraPedido>(url,twCarritoCompraPedido);
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
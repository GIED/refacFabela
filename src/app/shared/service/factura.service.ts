import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { TvVentasFactura } from '../../productos/model/TvVentasFactura';
import { CancelacionFacturaDto } from '../../productos/model/CancelacionFacturaDto';
import { ResultadoFacturacionVentaDto } from '../../productos/model/ResultadoFacturacionVentaDto';
import { StatusCfdiResponse } from '../../productos/model/StatusCfdiResponse';
import { CfdiRelacionadosResponse } from '../../productos/model/CfdiRelacionadosResponse';
import { SolicitudCancelacionDto } from '../../productos/model/SolicitudCancelacionDto';
import { SolicitudCancelacionAccionDto } from '../../productos/model/SolicitudCancelacionAccionDto';
import { CancelacionResponse } from '../../productos/model/CancelacionResponse';
import { ComplementoPagoHistorialDto } from '../../productos/model/ComplementoPagoHistorialDto';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http:HttpClient) { }

  obtenerVentaFactura(){
    let url = environment.servicios.apiRefacFabela + locator.consultaVentaFactura;
    return this.http.get<TvVentasFactura[]>(url);
  }
  consultaCreditos(nId:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaCreditos+'nDatoFactura='+nId;
    return this.http.get<number>(url);
  }
  obtenerFacturas(){
    let url = environment.servicios.apiRefacFabela + locator.consultaFacturas;
    return this.http.get<TvVentasFactura[]>(url);
  }

  facturarVenta(idVenta:number, cveCfdi:string){
    let url = environment.servicios.apiRefacFabela + locator.facturarVenta+ 'nIdVenta='+idVenta + '&cveCfdi='+cveCfdi;
    return this.http.get<ResultadoFacturacionVentaDto>(url);
  }

  facturarVentasConsolidadas(nIdsVenta:number[], cveCfdi:string){
    const url = environment.servicios.apiRefacFabela + locator.facturarVentasConsolidadas;
    return this.http.post<ResultadoFacturacionVentaDto>(url, {
      nIdsVenta,
      cveCfdi
    });
  }
  facturarComplemento(idVenta:number, cveCfdi:string){
    let url = environment.servicios.apiRefacFabela + locator.facturarComplemento+ 'nIdVenta='+idVenta + '&cveCfdi='+cveCfdi;
    return this.http.get<ResultadoFacturacionVentaDto>(url);
  }

  facturarComplementoPagoCliente(nIdPagoCliente:number){
    let url = environment.servicios.apiRefacFabela + locator.facturarComplementoPagoCliente + 'nIdPagoCliente=' + nIdPagoCliente;
    return this.http.post<ResultadoFacturacionVentaDto>(url, {});
  }

  reintentarComplemento(nIdComplemento:number){
    let url = environment.servicios.apiRefacFabela + locator.reintentarComplemento + 'nIdComplemento=' + nIdComplemento;
    return this.http.post<ResultadoFacturacionVentaDto>(url, {});
  }

  cancelarFactura(payload: CancelacionFacturaDto){
    let url = environment.servicios.apiRefacFabela + locator.cancelarFactura;
    return this.http.post<any>(url, payload);
  }

  consultarEstatusSat(nIdVenta:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaEstatusSat + 'nIdVenta=' + nIdVenta;
    return this.http.get<StatusCfdiResponse>(url);
  }

  consultarCfdiRelacionados(nIdVenta:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaCfdiRelacionados + 'nIdVenta=' + nIdVenta;
    return this.http.get<CfdiRelacionadosResponse>(url);
  }

  consultarComplementos(nIdVenta:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaComplementos + 'nIdVenta=' + nIdVenta;
    return this.http.get<ComplementoPagoHistorialDto[]>(url);
  }

  consultarSolicitudesPendientes(nIdDatoFactura:number){
    let url = environment.servicios.apiRefacFabela + locator.consultaSolicitudesPendientes + 'nIdDatoFactura=' + nIdDatoFactura;
    return this.http.get<SolicitudCancelacionDto[]>(url);
  }

  aceptarSolicitudPendiente(payload: SolicitudCancelacionAccionDto){
    let url = environment.servicios.apiRefacFabela + locator.aceptarSolicitudPendiente;
    return this.http.post<CancelacionResponse>(url, payload);
  }

  rechazarSolicitudPendiente(payload: SolicitudCancelacionAccionDto){
    let url = environment.servicios.apiRefacFabela + locator.rechazarSolicitudPendiente;
    return this.http.post<CancelacionResponse>(url, payload);
  }

  descargarDocumento(nIdVenta: number, tipoDoc:string){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.descargarDocuemento + 'nIdVenta=' + nIdVenta+'&TipoDoc='+tipoDoc, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );

  }

  descargarDocumentoComplemento(nIdComplemento: number, tipoDoc:string){
    const httpOptions = {
      responseType: 'arraybuffer' as 'json'
    };
    return this.http.get<any>(environment.servicios.apiRefacFabela + locator.descargarDocumentoComplemento + 'nIdComplemento=' + nIdComplemento+'&TipoDoc='+tipoDoc, httpOptions).pipe(
      catchError(e => {
        console.error(e);
        return throwError(e);
      })
    );
  }

  subirDocumento(formData: FormData) {
   // const formData = new FormData();
   // formData.append('file', file),
   // formData.append('venta', venta),
   // formData.append('uuio', uuid);


    return this.http.post<any>(environment.servicios.apiRefacFabela + locator.uploadDocuemento , formData) ;
  }

  
}

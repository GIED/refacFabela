import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { locator } from '../sesion/locator';
import { PagoClienteDetalleDto } from 'src/app/administracion/model/PagoClienteDetalleDto';
import { PagoClienteRegistroDto } from 'src/app/administracion/model/PagoClienteRegistroDto';
import { FacturaCreditoPendienteDto } from 'src/app/administracion/model/FacturaCreditoPendienteDto';
import { PagoAplicacionAutomaticaRequestDto } from 'src/app/administracion/model/PagoAplicacionAutomaticaRequestDto';
import { PagoAplicacionManualRequestDto } from 'src/app/administracion/model/PagoAplicacionManualRequestDto';
import { PagoAplicacionResultadoDto } from 'src/app/administracion/model/PagoAplicacionResultadoDto';
import { PagoAplicacionLineaDto } from 'src/app/administracion/model/PagoAplicacionLineaDto';

@Injectable({
  providedIn: 'root'
})
export class PagoClienteService {

  constructor(private http: HttpClient) { }

  consultarPagosCliente(nIdCliente: number) {
    const url = environment.servicios.apiRefacFabela + locator.consultarPagosClienteCanonico + 'nIdCliente=' + nIdCliente;
    return this.http.get<PagoClienteDetalleDto[]>(url);
  }

  consultarAplicacionesVenta(nIdVenta: number) {
    const url = environment.servicios.apiRefacFabela + locator.consultarAplicacionesVentaCanonico + 'nIdVenta=' + nIdVenta;
    return this.http.get<PagoAplicacionLineaDto[]>(url);
  }

  registrarPago(payload: PagoClienteRegistroDto) {
    const url = environment.servicios.apiRefacFabela + locator.registrarPagoClienteCanonico;
    return this.http.post<PagoClienteDetalleDto>(url, payload);
  }

  consultarFacturasPendientes(nIdCliente: number, nIdDatoFactura: number) {
    const url = environment.servicios.apiRefacFabela
      + locator.consultarFacturasPendientesPagoCanonico
      + 'nIdCliente=' + nIdCliente + '&nIdDatoFactura=' + nIdDatoFactura;
    return this.http.get<FacturaCreditoPendienteDto[]>(url);
  }

  aplicarAutomatico(nIdPagoCliente: number, payload: PagoAplicacionAutomaticaRequestDto) {
    const url = environment.servicios.apiRefacFabela + locator.aplicarPagoClienteCanonicoBase + nIdPagoCliente + '/aplicar/automatico';
    return this.http.post<PagoAplicacionResultadoDto>(url, payload || {});
  }

  aplicarManual(nIdPagoCliente: number, payload: PagoAplicacionManualRequestDto) {
    const url = environment.servicios.apiRefacFabela + locator.aplicarPagoClienteCanonicoBase + nIdPagoCliente + '/aplicar/manual';
    return this.http.post<PagoAplicacionResultadoDto>(url, payload);
  }
}
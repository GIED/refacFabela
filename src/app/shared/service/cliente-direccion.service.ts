import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { ClienteDireccionEnvio } from 'src/app/administracion/model/ClienteDireccionEnvio';
import { environment } from 'src/environments/environment';
import { StringUtils } from '../utils/StringUtils';
              // ⬅️ ajusta la ruta si difiere

@Injectable({
  providedIn: 'root'
})
export class ClienteDireccionService {

  constructor(private _http: HttpClient) {}

  // 📌 Obtener direcciones de un cliente (predeterminada primero)
  obtener(clienteId: number) {
    const params = new Map();
    params.set('clienteId', clienteId);

    return this._http.get<ClienteDireccionEnvio[]>(
      environment.servicios.apiRefacFabela
        .concat(Endpoint.listar)
        .concat(StringUtils.concatParams(params))
    );
  }

  // 📌 Obtener una dirección por ID (requiere clienteId y dirId)
  obtenerPorId(clienteId: number, dirId: number) {
    const params = new Map();
    params.set('clienteId', clienteId);
    params.set('dirId', dirId);

    return this._http.get<ClienteDireccionEnvio>(
      environment.servicios.apiRefacFabela
        .concat(Endpoint.obtenerById)
        .concat(StringUtils.concatParams(params))
    );
  }

  // 📌 Guardar dirección (crear o actualizar según tenga nId)
  guardar(clienteId: number, direccion: ClienteDireccionEnvio) {
    const params = new Map();
    params.set('clienteId', clienteId);

    const path = direccion?.nId ? Endpoint.editar : Endpoint.guardar;

    return this._http.post<ClienteDireccionEnvio>(
      environment.servicios.apiRefacFabela
        .concat(path)
        .concat(StringUtils.concatParams(params)),
      direccion
    );
  }

  // 📌 Eliminar una dirección (POST + query params)
  eliminar(clienteId: number, dirId: number) {
    const params = new Map();
    params.set('clienteId', clienteId);
    params.set('dirId', dirId);

    return this._http.post<void>(
      environment.servicios.apiRefacFabela
        .concat(Endpoint.eliminar)
        .concat(StringUtils.concatParams(params)),
      {}
    );
  }


  // ⭐ Extra: marcar como predeterminada (si lo usas en UI)
  predeterminada(clienteId: number, dirId: number) {
    const params = new Map();
    params.set('clienteId', clienteId);
    params.set('dirId', dirId);

    return this._http.post<void>(
      environment.servicios.apiRefacFabela
        .concat(Endpoint.predeterminada)
        .concat(StringUtils.concatParams(params)),
      {}
    );
  }
}

/* Endpoints reales del backend de direcciones (GET/POST con requestParam) */
const enum Endpoint {
  listar          = 'clientes/direcciones',            // GET ?clienteId=
  obtenerById     = 'clientes/direcciones/obtener',    // GET ?clienteId=&dirId=
  guardar         = 'clientes/direcciones/crear',      // POST ?clienteId=
  editar          = 'clientes/direcciones/editar',     // POST ?clienteId=&dirId= (se envía nId en body también)
  eliminar        = 'clientes/direcciones/eliminar',   // POST ?clienteId=&dirId=
  predeterminada  = 'clientes/direcciones/predeterminada' // POST ?clienteId=&dirId=
}

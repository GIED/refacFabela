import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { locator } from 'src/app/shared/sesion/locator';
import {
    InventarioUbicacionDto,
    InventarioUbicacionDetalleDto
} from '../model/InventarioUbicacionDto';
import { IniciarInventarioRequestDto } from '../model/IniciarInventarioRequestDto';
import { ActualizarConteoRequestDto } from '../model/ActualizarConteoRequestDto';
import { AutorizarInventarioRequestDto } from '../model/AutorizarInventarioRequestDto';

/**
 * Servicio Angular para gestionar el inventario electrónico por ubicación.
 */
@Injectable({
    providedIn: 'root'
})
export class InventarioUbicacionService {

    constructor(private http: HttpClient) { }

    /**
     * Iniciar un nuevo inventario por ubicación (rol ALMACÉN).
     */
    iniciarInventario(request: IniciarInventarioRequestDto): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.iniciarInventarioUbicacion;
        return this.http.post<InventarioUbicacionDto>(url, request);
    }

    /**
     * Sincronizar inventario con tw_productobodega.
     */
    sincronizarInventario(inventarioId: number): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.sincronizarInventarioUbicacion + inventarioId + '/sync';
        return this.http.post<InventarioUbicacionDto>(url, {});
    }

    /**
     * Obtener inventario completo con detalle.
     */
    obtenerInventario(inventarioId: number): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.obtenerInventarioUbicacion + inventarioId;
        return this.http.get<InventarioUbicacionDto>(url);
    }

    /**
     * Obtener el inventario abierto/pausado del usuario actual.
     */
    obtenerInventarioAbiertoUsuario(): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.obtenerInventarioAbiertoUsuario;
        return this.http.get<InventarioUbicacionDto>(url);
    }

    /**
     * Listar todos los inventarios.
     */
    listarInventarios(): Observable<InventarioUbicacionDto[]> {
        const url = environment.servicios.apiRefacFabela + locator.listarInventariosUbicacion;
        return this.http.get<InventarioUbicacionDto[]>(url);
    }

    /**
     * Listar inventarios pendientes de autorización (rol ADMIN).
     */
    listarInventariosPendientesAutorizacion(): Observable<InventarioUbicacionDto[]> {
        const url = environment.servicios.apiRefacFabela + locator.listarInventariosPendientesAutorizacion;
        return this.http.get<InventarioUbicacionDto[]>(url);
    }

    /**
     * Obtener inventarios filtrados por estatus.
     */
    obtenerInventariosPorEstatus(estatus: number): Observable<InventarioUbicacionDto[]> {
        const url = environment.servicios.apiRefacFabela + locator.obtenerInventariosPorEstatus + '?estatus=' + estatus;
        return this.http.get<InventarioUbicacionDto[]>(url);
    }

    /**
     * Actualizar conteo de un producto (rol ALMACÉN).
     */
    actualizarConteo(
        inventarioId: number,
        productoId: number,
        request: ActualizarConteoRequestDto
    ): Observable<InventarioUbicacionDetalleDto> {
        const url = environment.servicios.apiRefacFabela + locator.actualizarConteoInventario 
                  + inventarioId + '/detalle/' + productoId;
        return this.http.put<InventarioUbicacionDetalleDto>(url, request);
    }

    /**
     * Pausar inventario (rol ALMACÉN).
     */
    pausarInventario(inventarioId: number): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.pausarInventarioUbicacion + inventarioId + '/pausar';
        return this.http.post<InventarioUbicacionDto>(url, {});
    }

    /**
     * Reanudar inventario pausado (rol ALMACÉN).
     */
    reanudarInventario(inventarioId: number): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.reanudarInventarioUbicacion + inventarioId + '/reanudar';
        return this.http.post<InventarioUbicacionDto>(url, {});
    }

    /**
     * Cerrar inventario para revisión (rol ALMACÉN).
     */
    cerrarInventario(inventarioId: number): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.cerrarInventarioUbicacion + inventarioId + '/cerrar';
        return this.http.post<InventarioUbicacionDto>(url, {});
    }

    /**
     * Autorizar inventario (rol ADMIN).
     */
    autorizarInventario(inventarioId: number, motivo: string): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.autorizarInventarioUbicacion + inventarioId + '/autorizar';
        return this.http.post<InventarioUbicacionDto>(url, { sMotivoAutorizacion: motivo });
    }

    /**
     * Rechazar inventario y regresar a estado ABIERTO (rol ADMIN).
     */
    rechazarInventario(inventarioId: number, motivo: string): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.rechazarInventarioUbicacion + inventarioId + '/rechazar';
        return this.http.post<InventarioUbicacionDto>(url, { sMotivoRechazo: motivo });
    }

    /**
     * Realizar ajuste individual de un producto con diferencia (rol ADMIN).
     * Actualiza tw_productobodega y marca el detalle como ajustado.
     */
    ajustarProductoInventario(
        inventarioId: number,
        productoId: number,
        motivoAjuste: string
    ): Observable<InventarioUbicacionDetalleDto> {
        const url = environment.servicios.apiRefacFabela + locator.ajustarProductoInventario 
                  + inventarioId + '/detalle/' + productoId + '/ajustar';
        return this.http.post<InventarioUbicacionDetalleDto>(url, { sMotivoAjuste: motivoAjuste });
    }

    /**
     * Aplicar inventario al stock operativo (rol ADMIN).
     */
    aplicarInventario(inventarioId: number): Observable<InventarioUbicacionDto> {
        const url = environment.servicios.apiRefacFabela + locator.aplicarInventarioUbicacion + inventarioId + '/aplicar';
        return this.http.post<InventarioUbicacionDto>(url, {});
    }

    /**
     * Obtener historial de cambios del inventario.
     */
    obtenerHistorial(inventarioId: number): Observable<any[]> {
        const url = environment.servicios.apiRefacFabela + locator.obtenerHistorialInventario + inventarioId + '/historial';
        return this.http.get<any[]>(url);
    }
}

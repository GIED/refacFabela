import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InventarioUbicacionService } from '../../service/inventario-ubicacion.service';
import {
    InventarioUbicacionDto,
    InventarioUbicacionDetalleDto
} from '../../model/InventarioUbicacionDto';
import { EstatusInventario, DESCRIPCION_ESTATUS_INVENTARIO } from '../../model/InventarioEnums';

@Component({
    selector: 'app-autorizacion-inventario',
    templateUrl: './autorizacion-inventario.component.html',
    styleUrls: ['./autorizacion-inventario.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class AutorizacionInventarioComponent implements OnInit {

    // Listas de inventarios
    inventariosPendientes: InventarioUbicacionDto[] = [];
    inventarioSeleccionado: InventarioUbicacionDto | null = null;
    
    // Productos con diferencias del inventario seleccionado
    productosDiferencias: InventarioUbicacionDetalleDto[] = [];
    
    // Controles de vista
    mostrarDialogoDetalle = false;
    mostrarDialogoAutorizar = false;
    mostrarDialogoAjustar = false;
    cargando = false;
    
    // Formulario de autorización
    motivoAutorizacion = '';
    accionAutorizacion: 'autorizar' | 'rechazar' = 'autorizar';

    // Formulario de ajuste individual
    productoAjustar: InventarioUbicacionDetalleDto | null = null;
    motivoAjuste = '';

    // Constantes de estatus
    EstatusInventario = EstatusInventario;
    DESCRIPCION_ESTATUS = DESCRIPCION_ESTATUS_INVENTARIO;

    // Imágenes de productos
    rutaImagenDefault: string = 'assets/layout/images/default.png';
    imagenAmpliada: string | null = null;
    mostrarImagenAmpliada: boolean = false;

    constructor(
        private inventarioService: InventarioUbicacionService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.cargarInventariosPendientes();
    }

    /**
     * Obtener URL de la imagen del producto
     */
    obtenerRutaImagen(noParte: string): string {
        return 'https://www.ctpsales.costex.com:11443/Webpics/220x220/' + noParte + '.jpg';
    }

    /**
     * Manejar error cuando la imagen no existe
     */
    imagenError(event: Event) {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = this.rutaImagenDefault;
    }

    /**
     * Ampliar imagen en modal
     */
    ampliarImagen(noParte: string) {
        this.imagenAmpliada = this.obtenerRutaImagen(noParte);
        this.mostrarImagenAmpliada = true;
    }

    /**
     * Cerrar modal de imagen ampliada
     */
    cerrarImagenAmpliada() {
        this.mostrarImagenAmpliada = false;
        this.imagenAmpliada = null;
    }

    /**
     * Cargar inventarios pendientes de autorización (EN_REVISION).
     */
    cargarInventariosPendientes(): void {
        this.cargando = true;
        this.inventarioService.listarInventariosPendientesAutorizacion().subscribe({
            next: (data) => {
                this.inventariosPendientes = data;
                this.cargando = false;
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al cargar inventarios pendientes');
            }
        });
    }

    /**
     * Ver detalle del inventario y sus diferencias.
     */
    verDetalleInventario(inventario: InventarioUbicacionDto): void {
        this.cargando = true;
        this.inventarioService.obtenerInventario(inventario.nId!).subscribe({
            next: (data) => {
                this.inventarioSeleccionado = data;
                
                // Filtrar productos con diferencias
                this.productosDiferencias = (data.detalle || []).filter(
                    item => item.nCantidadContada != null && item.nDiferencia !== 0
                );
                
                this.cargando = false;
                this.mostrarDialogoDetalle = true;
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al cargar detalle del inventario');
            }
        });
    }

    /**
     * Abrir diálogo para autorizar/rechazar inventario.
     */
    abrirDialogoAutorizar(accion: 'autorizar' | 'rechazar'): void {
        this.accionAutorizacion = accion;
        this.motivoAutorizacion = '';
        this.mostrarDialogoAutorizar = true;
    }

    /**
     * Abrir diálogo para ajustar un producto individual.
     */
    abrirDialogoAjustar(producto: InventarioUbicacionDetalleDto): void {
        this.productoAjustar = producto;
        this.motivoAjuste = '';
        this.mostrarDialogoAjustar = true;
    }

    /**
     * Confirmar ajuste individual de producto.
     */
    confirmarAjusteProducto(): void {
        if (!this.inventarioSeleccionado || !this.productoAjustar) return;

        if (!this.motivoAjuste || this.motivoAjuste.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'Debe proporcionar un motivo para el ajuste'
            });
            return;
        }

        this.cargando = true;
        this.inventarioService.ajustarProductoInventario(
            this.inventarioSeleccionado.nId!,
            this.productoAjustar.nIdProducto!,
            this.motivoAjuste
        ).subscribe({
            next: (data) => {
                // Actualizar el producto en la lista de diferencias
                const index = this.productosDiferencias.findIndex(
                    p => p.nIdProducto === this.productoAjustar!.nIdProducto
                );
                if (index >= 0) {
                    this.productosDiferencias[index] = data;
                }

                // Actualizar también en el inventario completo
                if (this.inventarioSeleccionado.detalle) {
                    const indexDetalle = this.inventarioSeleccionado.detalle.findIndex(
                        p => p.nIdProducto === this.productoAjustar!.nIdProducto
                    );
                    if (indexDetalle >= 0) {
                        this.inventarioSeleccionado.detalle[indexDetalle] = data;
                    }
                }

                this.cargando = false;
                this.mostrarDialogoAjustar = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Ajuste realizado',
                    detail: `El producto ${data.sNoParte} fue ajustado exitosamente`
                });
                this.productoAjustar = null;
                this.motivoAjuste = '';
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError(err.error?.mensaje || 'Error al realizar el ajuste');
            }
        });
    }

    /**
     * Confirmar autorización o rechazo del inventario.
     */
    confirmarAutorizacion(): void {
        if (!this.inventarioSeleccionado) return;

        if (!this.motivoAutorizacion || this.motivoAutorizacion.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'Debe proporcionar un motivo para esta acción'
            });
            return;
        }

        this.cargando = true;
        
        if (this.accionAutorizacion === 'autorizar') {
            this.autorizarInventario();
        } else {
            this.rechazarInventario();
        }
    }

    /**
     * Autorizar el ajuste de inventario.
     */
    autorizarInventario(): void {
        if (!this.inventarioSeleccionado) return;

        this.inventarioService.autorizarInventario(
            this.inventarioSeleccionado.nId!,
            this.motivoAutorizacion
        ).subscribe({
            next: (data) => {
                this.cargando = false;
                this.mostrarDialogoAutorizar = false;
                this.mostrarDialogoDetalle = false;
                
                this.messageService.add({
                    severity: 'success',
                    summary: 'Inventario autorizado',
                    detail: `El inventario #${data.nId} fue autorizado exitosamente`
                });
                
                // Recargar la lista
                this.cargarInventariosPendientes();
                this.inventarioSeleccionado = null;
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError(err.error?.mensaje || 'Error al autorizar inventario');
            }
        });
    }

    /**
     * Rechazar el inventario (regresar a estado ABIERTO).
     */
    rechazarInventario(): void {
        if (!this.inventarioSeleccionado) return;

        this.inventarioService.rechazarInventario(
            this.inventarioSeleccionado.nId!,
            this.motivoAutorizacion
        ).subscribe({
            next: (data) => {
                this.cargando = false;
                this.mostrarDialogoAutorizar = false;
                this.mostrarDialogoDetalle = false;
                
                this.messageService.add({
                    severity: 'info',
                    summary: 'Inventario rechazado',
                    detail: `El inventario #${data.nId} fue reabierto para correcciones`
                });
                
                // Recargar la lista
                this.cargarInventariosPendientes();
                this.inventarioSeleccionado = null;
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError(err.error?.mensaje || 'Error al rechazar inventario');
            }
        });
    }

    /**
     * Calcular totales de diferencias.
     */
    get cantidadFaltantes(): number {
        return this.productosDiferencias.filter(p => (p.nDiferencia || 0) < 0).length;
    }

    get cantidadSobrantes(): number {
        return this.productosDiferencias.filter(p => (p.nDiferencia || 0) > 0).length;
    }

    get totalDiferencias(): number {
        return this.productosDiferencias.length;
    }

    /**
     * Obtener cantidad de productos con diferencias en un inventario específico.
     */
    obtenerCantidadConDiferencias(inventario: InventarioUbicacionDto): number {
        if (!inventario.detalle || inventario.detalle.length === 0) {
            return 0;
        }
        return inventario.detalle.filter(
            item => item.nCantidadContada != null && item.nDiferencia !== 0
        ).length;
    }

    /**
     * Validar si todos los productos con diferencias han sido ajustados.
     */
    get todosProductosAjustados(): boolean {
        if (this.productosDiferencias.length === 0) {
            return true; // Si no hay diferencias, está listo para autorizar
        }
        return this.productosDiferencias.every(p => p.bAjustado === true);
    }

    /**
     * Obtener cantidad de productos pendientes de ajustar.
     */
    get productosPendientesAjuste(): number {
        return this.productosDiferencias.filter(p => !p.bAjustado).length;
    }

    /**
     * Mostrar mensaje de error.
     */
    mostrarError(mensaje: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: mensaje
        });
    }

    /**
     * Obtener severidad del badge según estatus.
     */
    getEstatusSeverity(estatus: number): string {
        switch (estatus) {
            case EstatusInventario.ABIERTO: return 'success';
            case EstatusInventario.PAUSADO: return 'warning';
            case EstatusInventario.EN_REVISION: return 'info';
            case EstatusInventario.AUTORIZADO: return 'success';
            case EstatusInventario.APLICADO: return 'success';
            case EstatusInventario.CANCELADO: return 'danger';
            default: return 'secondary';
        }
    }
}

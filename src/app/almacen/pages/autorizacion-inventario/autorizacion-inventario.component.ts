import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { InventarioUbicacionService } from '../../service/inventario-ubicacion.service';
import {
    InventarioUbicacionDto,
    InventarioUbicacionDetalleDto
} from '../../model/InventarioUbicacionDto';
import { EstatusInventario, DESCRIPCION_ESTATUS_INVENTARIO } from '../../model/InventarioEnums';
import { ProductoService } from 'src/app/shared/service/producto.service';

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
    
    // Productos que requieren re-conteo por cambios en stock
    productosRequierenReconteo: InventarioUbicacionDetalleDto[] = [];
    hayProductosConCambioStock: boolean = false;
    
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
    cantidadCorregida: number | null = null;
    usarCantidadCorregida = false;

    // Formulario de re-conteo de productos con stock obsoleto
    mostrarDialogoReconteo = false;
    productosReconteoFormulario: Array<{
        producto: InventarioUbicacionDetalleDto;
        nCantidadContada: number | null;
        motivo: string;
        procesando: boolean;
    }> = [];

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
        private confirmationService: ConfirmationService,
        private productoService: ProductoService
    ) { }

    ngOnInit(): void {
        this.cargarInventariosPendientes();
    }

    /**
     * Obtener URL de la imagen del producto.
     * Retorna URL cacheada o default, y resuelve la URL real en background.
     */
    imagenesCache: {[key: string]: string} = {};
    obtenerRutaImagen(noParte: string): string {
        if (!noParte) return this.rutaImagenDefault;
        if (this.imagenesCache[noParte]) return this.imagenesCache[noParte];
        this.imagenesCache[noParte] = this.rutaImagenDefault;
        this.productoService.resolverImagenProducto(noParte).subscribe({
            next: (res) => {
                this.imagenesCache[noParte] = res.encontrada === 'true' ? res.url : this.rutaImagenDefault;
            },
            error: () => {
                this.imagenesCache[noParte] = this.rutaImagenDefault;
            }
        });
        return this.imagenesCache[noParte];
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

                // Detectar productos que requieren re-conteo (stock cambió desde levantamiento)
                this.productosRequierenReconteo = (data.detalle || []).filter(
                    item => item.bRequiereReconteo === true
                );
                this.hayProductosConCambioStock = this.productosRequierenReconteo.length > 0;

                // Mostrar aviso si hay productos con stock obsoleto
                if (this.hayProductosConCambioStock) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: '⚠️ Stock Obsoleto Detectado',
                        detail: `${this.productosRequierenReconteo.length} producto(s) con cambios en stock desde el levantamiento. Requiere re-conteo.`,
                        life: 5000
                    });
                }
                
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
     * Abrir diálogo para hacer re-conteo de productos con stock obsoleto.
     */
    abrirDialogoReconteo(): void {
        // Inicializar el formulario de reconteo con los productos que requieren reconteo
        this.productosReconteoFormulario = this.productosRequierenReconteo.map(producto => ({
            producto: producto,
            nCantidadContada: producto.nCantidadContada || null, // Pre-llenar con cantidad actual
            motivo: 'Stock cambió en sistema',
            procesando: false
        }));

        this.mostrarDialogoReconteo = true;
    }

    /**
     * Guardar re-conteo individual de un producto.
     */
    guardarReconteoProducto(formularioItem: any): void {
        const producto = formularioItem.producto;

        // Validaciones
        if (formularioItem.nCantidadContada === null || formularioItem.nCantidadContada === undefined) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: `Debe ingresar la cantidad contada para ${producto.sNoParte}`
            });
            return;
        }

        if (formularioItem.nCantidadContada < 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'La cantidad contada no puede ser negativa'
            });
            return;
        }

        if (!formularioItem.motivo || formularioItem.motivo.trim() === '') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'Debe proporcionar un motivo para el re-conteo'
            });
            return;
        }

        formularioItem.procesando = true;

        this.recontarProducto(
            producto.nIdProducto,
            formularioItem.nCantidadContada,
            formularioItem.motivo
        );
    }

    /**
     * Recontar un producto individual que tiene stock obsoleto.
     * Actualiza la referencia al stock actual y captura la nueva cantidad.
     */
    recontarProducto(productoId: number, nCantidadContada: number, motivo: string): void {
        if (!this.inventarioSeleccionado) return;

        this.inventarioService.recontarProductoInventario(
            this.inventarioSeleccionado.nId!,
            productoId,
            nCantidadContada,
            motivo
        ).subscribe({
            next: (detalle) => {
                // Remover de la lista de productos que requieren reconteo
                const index = this.productosRequierenReconteo.findIndex(
                    p => p.nIdProducto === productoId
                );
                if (index >= 0) {
                    this.productosRequierenReconteo.splice(index, 1);
                }

                // Actualizar en el formulario de reconteo
                const indexForm = this.productosReconteoFormulario.findIndex(
                    p => p.producto.nIdProducto === productoId
                );
                if (indexForm >= 0) {
                    this.productosReconteoFormulario[indexForm].procesando = false;
                }

                // Actualizar también en el inventario completo
                if (this.inventarioSeleccionado && this.inventarioSeleccionado.detalle) {
                    const indexDetalle = this.inventarioSeleccionado.detalle.findIndex(
                        p => p.nIdProducto === productoId
                    );
                    if (indexDetalle >= 0) {
                        this.inventarioSeleccionado.detalle[indexDetalle] = detalle;
                    }
                }

                // Actualizar también en la lista de diferencias
                const indexDif = this.productosDiferencias.findIndex(
                    p => p.nIdProducto === productoId
                );
                if (indexDif >= 0) {
                    this.productosDiferencias[indexDif] = detalle;
                }

                this.hayProductosConCambioStock = this.productosRequierenReconteo.length > 0;

                // Si no hay más productos por recontar, cerrar el diálogo
                if (this.productosRequierenReconteo.length === 0) {
                    this.mostrarDialogoReconteo = false;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Re-Conteo Completado',
                        detail: 'Todos los productos han sido recontados exitosamente.'
                    });
                } else {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Re-Conteo Completado',
                        detail: `${detalle.sNoParte} fue recontado. ${this.productosRequierenReconteo.length} productos restantes.`
                    });
                }
            },
            error: (err) => {
                // Marcar como no procesando para permitir reintentar
                const indexForm = this.productosReconteoFormulario.findIndex(
                    p => p.producto.nIdProducto === productoId
                );
                if (indexForm >= 0) {
                    this.productosReconteoFormulario[indexForm].procesando = false;
                }

                this.mostrarError(err.error?.mensaje || 'Error al hacer re-conteo del producto');
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
        this.cantidadCorregida = producto.nCantidadContada;
        this.usarCantidadCorregida = false;
        this.mostrarDialogoAjustar = true;
    }

    /**
     * Calcula la diferencia en tiempo real según la cantidad (corregida o contada).
     */
    get diferenciaAjuste(): number {
        if (!this.productoAjustar) return 0;
        const cantidad = this.usarCantidadCorregida && this.cantidadCorregida !== null
            ? this.cantidadCorregida
            : (this.productoAjustar.nCantidadContada || 0);
        return cantidad - (this.productoAjustar.nCantidadTeoricaRef || 0);
    }

    /**
     * Cantidad final que se aplicará al sistema.
     */
    get cantidadFinalAjuste(): number {
        if (!this.productoAjustar) return 0;
        return this.usarCantidadCorregida && this.cantidadCorregida !== null
            ? this.cantidadCorregida
            : (this.productoAjustar.nCantidadContada || 0);
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
        const cantidadEnviar = this.usarCantidadCorregida ? this.cantidadCorregida : undefined;
        this.inventarioService.ajustarProductoInventario(
            this.inventarioSeleccionado.nId!,
            this.productoAjustar.nIdProducto!,
            this.motivoAjuste,
            cantidadEnviar
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

        // VALIDACIÓN CRÍTICA: No permitir autorización si hay productos con stock obsoleto
        if (this.accionAutorizacion === 'autorizar' && this.hayProductosConCambioStock) {
            this.messageService.add({
                severity: 'error',
                summary: 'Operación No Permitida',
                detail: `No se puede autorizar el inventario. Hay ${this.productosRequierenReconteo.length} producto(s) con stock obsoleto que requiere(n) re-conteo.`
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
                    detail: `El inventario #${data.nId} fue autorizado y el correo de notificación se envió con éxito.`
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
     * Generar tooltip dinámico para el botón de autorizar.
     */
    getTooltipAutorizar(): string {
        if (this.hayProductosConCambioStock) {
            return `⚠️ No puede autorizar: ${this.productosRequierenReconteo?.length || 0} producto(s) con stock obsoleto requiere(n) re-conteo`;
        }
        if (!this.todosProductosAjustados) {
            return `Debe ajustar todos los productos con diferencias antes de autorizar`;
        }
        return '';
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

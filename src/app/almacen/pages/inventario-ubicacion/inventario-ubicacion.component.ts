import { Component, OnInit } from '@angular/core';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import { InventarioUbicacionService } from '../../service/inventario-ubicacion.service';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { AnaquelService } from 'src/app/shared/service/anaquel.service';
import { NivelService } from 'src/app/shared/service/nivel.service';
import {
    InventarioUbicacionDto,
    InventarioUbicacionDetalleDto
} from '../../model/InventarioUbicacionDto';
import { IniciarInventarioRequestDto } from '../../model/IniciarInventarioRequestDto';
import { ActualizarConteoRequestDto } from '../../model/ActualizarConteoRequestDto';
import { EstatusInventario, DESCRIPCION_ESTATUS_INVENTARIO } from '../../model/InventarioEnums';
import { TcBodega } from 'src/app/productos/model/TcBodega';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';
import { TcNivel } from 'src/app/productos/model/TcNivel';

@Component({
    selector: 'app-inventario-ubicacion',
    templateUrl: './inventario-ubicacion.component.html',
    styleUrls: ['./inventario-ubicacion.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class InventarioUbicacionComponent implements OnInit {

    // Controles de vista
    mostrarDialogoIniciar = false;
    mostrarDialogoCaptura = false;
    cargando = false;

    // Inventario actual
    inventarioActual: InventarioUbicacionDto | null = null;
    detalleSeleccionado: InventarioUbicacionDetalleDto | null = null;

    // Catálogos
    bodegas: TcBodega[] = [];
    anaqueles: TcAnaquel[] = [];
    niveles: TcNivel[] = [];

    // Menú de opciones
    items: MenuItem[] = [];

    // Formulario de inicio
    formIniciar: IniciarInventarioRequestDto = new IniciarInventarioRequestDto();

    // Formulario de captura
    formCaptura: ActualizarConteoRequestDto = new ActualizarConteoRequestDto();

    // Constantes de estatus
    EstatusInventario = EstatusInventario;
    DESCRIPCION_ESTATUS = DESCRIPCION_ESTATUS_INVENTARIO;

    // Imágenes de productos
    rutaImagenDefault: string = 'assets/layout/images/default.png';
    imagenAmpliada: string | null = null;
    mostrarImagenAmpliada: boolean = false;

    // Detección de dispositivo móvil/tablet para dropdowns
    esMobile: boolean = false;

    constructor(
        private inventarioService: InventarioUbicacionService,
        private bodegasService: BodegasService,
        private anaquelService: AnaquelService,
        private nivelService: NivelService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.detectarMobile();
        this.cargarCatalogos();
        this.verificarInventarioAbierto();
        this.configurarMenu();
    }

    /**
     * Detectar si es dispositivo móvil o tablet para ajustar comportamiento de dropdowns.
     * En móviles el teclado virtual causa que los dropdowns se cierren al filtrar.
     */
    detectarMobile(): void {
        this.esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                        || ('ontouchstart' in window) 
                        || (window.innerWidth < 1024);
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

    configurarMenu(): void {
        this.actualizarMenu();
    }

    /**
     * Actualizar menú dinámicamente según estado del inventario.
     */
    actualizarMenu(): void {
        const puedeReanudar = this.inventarioActual?.nEstatus === EstatusInventario.PAUSADO;
        const puedePausar = this.inventarioActual?.nEstatus === EstatusInventario.ABIERTO;
        const puedeCerrar = (this.inventarioActual?.nEstatus === EstatusInventario.ABIERTO || 
                            this.inventarioActual?.nEstatus === EstatusInventario.PAUSADO) &&
                            this.inventarioActual?.lineasPendientes === 0;

        this.items = [
            {
                label: 'Acciones de Inventario',
                items: [
                    {
                        label: 'Sincronizar',
                        icon: 'pi pi-refresh',
                        command: () => this.sincronizarAutomatico(),
                        disabled: !this.inventarioActual
                    },
                    {
                        label: 'Pausar',
                        icon: 'pi pi-pause',
                        command: () => this.pausarInventario(),
                        disabled: !puedePausar
                    },
                    {
                        label: 'Reanudar',
                        icon: 'pi pi-play',
                        command: () => this.reanudarInventario(),
                        disabled: !puedeReanudar
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Finalizar Inventario',
                        icon: 'pi pi-check-square',
                        command: () => this.confirmarCerrarInventario(),
                        disabled: !puedeCerrar,
                        title: !puedeCerrar && this.inventarioActual?.lineasPendientes ? 
                               `Hay ${this.inventarioActual.lineasPendientes} línea(s) pendiente(s)` : ''
                    }
                ]
            }
        ];
    }

    /**
     * Cargar catálogos necesarios (bodegas, anaqueles, niveles).
     */
    cargarCatalogos(): void {
        this.bodegasService.obtenerBodegas().subscribe({
            next: (data) => this.bodegas = data,
            error: (err) => this.mostrarError('Error al cargar bodegas')
        });

        this.anaquelService.obtenerAnanquel().subscribe({
            next: (data) => this.anaqueles = data,
            error: (err) => this.mostrarError('Error al cargar anaqueles')
        });

        this.nivelService.obtenerNivel().subscribe({
            next: (data) => this.niveles = data,
            error: (err) => this.mostrarError('Error al cargar niveles')
        });
    }

    /**
     * Verificar si el usuario tiene un inventario abierto/pausado.
     */
    verificarInventarioAbierto(): void {
        this.inventarioService.obtenerInventarioAbiertoUsuario().subscribe({
            next: (data: any) => {
                if (data && data.nId) {
                    this.inventarioActual = data;
                    this.sincronizarAutomatico();
                }
            },
            error: (err) => {
                // No hacer nada si no hay inventario abierto (es normal)
            }
        });
    }

    /**
     * SYNC automático al abrir/reanudar.
     */
    sincronizarAutomatico(): void {
        if (!this.inventarioActual) return;

        this.cargando = true;
        this.inventarioService.sincronizarInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.inventarioActual = data;
                this.cargando = false;
                this.actualizarMenu(); // Actualizar menú con nuevo estado
                
                // Mostrar mensaje de sincronización personalizado centrado
                const mensajeCambios = data.sMensajeSincronizacion || 'Sin cambios detectados';
                
                // Siempre mostrar como advertencia (warn) para que resalte
                this.messageService.add({
                    severity: 'warn',
                    summary: '📊 Sincronización Completada',
                    detail: mensajeCambios,
                    life: 8000,
                    sticky: false,
                    closable: true,
                    key: 'tc' // Para que aparezca centrado arriba
                });
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al sincronizar inventario');
            }
        });
    }

    /**
     * Abrir diálogo para iniciar nuevo inventario.
     */
    abrirDialogoIniciar(): void {
        this.formIniciar = new IniciarInventarioRequestDto();
        this.mostrarDialogoIniciar = true;
    }

    /**
     * Iniciar nuevo inventario.
     */
    iniciarInventario(): void {
        if (!this.validarFormularioIniciar()) return;

        this.cargando = true;
        this.inventarioService.iniciarInventario(this.formIniciar).subscribe({
            next: (data) => {
                // Corrección: Forzamos sincronización inmediata para asegurar que todos los 
                // datos descriptivos (Bodega, Productos, Marcas) estén poblados, ya que
                // la respuesta inicial puede venir incompleta.
                if (data && data.nId) {
                    this.inventarioService.sincronizarInventario(data.nId).subscribe({
                        next: (fullData) => {
                            this.inventarioActual = fullData;
                            this.cargando = false;
                            this.mostrarDialogoIniciar = false;
                            this.actualizarMenu(); // Actualizar menú con nuevo inventario
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Inventario iniciado',
                                detail: `Inventario #${fullData.nId} creado exitosamente`
                            });
                        },
                        error: (err) => {
                            // Fallback en caso de error de red en la 2da llamada
                            this.inventarioActual = data;
                            this.cargando = false;
                            this.mostrarDialogoIniciar = false;
                            this.actualizarMenu(); // Actualizar menú aunque la sincronización falle
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Inventario iniciado',
                                detail: `Inventario #${data.nId} creado. Puede requerir recargar.`
                            });
                        }
                    });
                } else {
                    this.cargando = false;
                    this.mostrarError('Error: Respuesta inválida del servidor');
                }
            },
            error: (err) => {
                this.cargando = false;
                
                // Si el servidor devolvió 409 con el inventario existente, cargarlo automáticamente
                if (err.status === 409 && err.error?.nId) {
                    this.inventarioActual = err.error;
                    this.mostrarDialogoIniciar = false;
                    this.actualizarMenu();
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'Inventario existente',
                        detail: `Ya tiene el inventario #${err.error.nId} abierto. Se cargó automáticamente.`
                    });
                    // Sincronizar para tener datos frescos
                    this.sincronizarAutomatico();
                    return;
                }
                
                this.mostrarError(err.error?.mensaje || 'Error al iniciar inventario');
            }
        });
    }

    /**
     * Validar formulario de inicio.
     */
    validarFormularioIniciar(): boolean {
        if (!this.formIniciar.nIdBodega || !this.formIniciar.nIdAnaquel || !this.formIniciar.nIdNivel) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Validación',
                detail: 'Debe seleccionar bodega, anaquel y nivel'
            });
            return false;
        }
        return true;
    }

    /**
     * Abrir diálogo para capturar/editar conteo.
     */
    abrirDialogoCaptura(detalle: InventarioUbicacionDetalleDto): void {
        this.detalleSeleccionado = detalle;
        this.formCaptura = new ActualizarConteoRequestDto();
        this.formCaptura.nCantidadContada = detalle.nCantidadContada;
        this.formCaptura.sObservacion = detalle.sObservacion;
        this.mostrarDialogoCaptura = true;
    }

    /**
     * Guardar conteo.
     */
    guardarConteo(): void {
        if (!this.inventarioActual || !this.detalleSeleccionado) return;

        this.cargando = true;
        this.inventarioService.actualizarConteo(
            this.inventarioActual.nId!,
            this.detalleSeleccionado.nIdProducto!,
            this.formCaptura
        ).subscribe({
            next: (data) => {
                // Actualizar el detalle en la lista
                const index = this.inventarioActual!.detalle!.findIndex(
                    d => d.nIdProducto === this.detalleSeleccionado!.nIdProducto
                );
                if (index >= 0) {
                    this.inventarioActual!.detalle![index] = data;
                }

                this.cargando = false;
                this.mostrarDialogoCaptura = false;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Conteo guardado',
                    detail: 'Conteo actualizado exitosamente'
                });

                // Recargar inventario completo para actualizar estadísticas
                this.recargarInventario();
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al guardar conteo');
            }
        });
    }

    /**
     * Pausar inventario.
     */
    pausarInventario(): void {
        if (!this.inventarioActual) return;

        this.cargando = true;
        this.inventarioService.pausarInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.inventarioActual = data;
                this.cargando = false;
                this.actualizarMenu(); // Actualizar menú con nuevo estado
                this.messageService.add({
                    severity: 'info',
                    summary: 'Inventario pausado',
                    detail: 'Puede reanudarlo más tarde'
                });
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al pausar inventario');
            }
        });
    }

    /**
     * Reanudar inventario.
     */
    reanudarInventario(): void {
        if (!this.inventarioActual) return;

        this.cargando = true;
        this.inventarioService.reanudarInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.inventarioActual = data;
                this.cargando = false;
                this.actualizarMenu(); // Actualizar menú con nuevo estado
                this.messageService.add({
                    severity: 'success',
                    summary: 'Inventario reanudado',
                    detail: 'Inventario sincronizado y listo para continuar'
                });
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al reanudar inventario');
            }
        });
    }

    /**
     * Confirmar antes de cerrar inventario con sincronización previa.
     */
    confirmarCerrarInventario(): void {
        if (!this.inventarioActual) return;

        // Primero sincronizar para obtener datos actualizados
        this.cargando = true;
        this.inventarioService.obtenerInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.inventarioActual = data;
                this.cargando = false;

                // Validar líneas pendientes calculadas dinámicamente
                const pendientes = this.lineasPendientes;
                if (pendientes > 0) {
                    this.messageService.add({
                        severity: 'warn',
                        summary: 'No se puede cerrar',
                        detail: `Hay ${pendientes} línea(s) pendiente(s) de contar. Por favor, complete el conteo de todos los productos.`,
                        life: 5000
                    });
                    this.actualizarMenu();
                    return;
                }

                // Calcular correctamente los productos con diferencias
                const productosDiferencias = this.lineasRecontar;
                const hayDiferencias = productosDiferencias > 0;
                
                // Configurar mensaje según si hay diferencias o no
                let mensaje: string;
                let headerTexto: string;
                let severityIcon: string;
                
                if (hayDiferencias) {
                    mensaje = `¿Está seguro de finalizar el inventario #${this.inventarioActual.nId}?<br><br>
                              <strong>Resumen:</strong><br>
                              • Total de productos: ${this.totalLineas}<br>
                              • Productos contados: ${this.lineasContadas}<br>
                              • <span style="color: #ef4444;">Productos con diferencias: ${productosDiferencias}</span><br><br>
                              <strong style="color: #f59e0b;">⚠️ El inventario pasará a estado EN REVISIÓN</strong><br>
                              Un administrador deberá revisar y autorizar las diferencias detectadas.`;
                    headerTexto = 'Confirmar Finalización - Requiere Revisión';
                    severityIcon = 'pi pi-exclamation-triangle';
                } else {
                    mensaje = `¿Está seguro de finalizar el inventario #${this.inventarioActual.nId}?<br><br>
                              <strong>Resumen:</strong><br>
                              • Total de productos: ${this.totalLineas}<br>
                              • Productos contados: ${this.lineasContadas}<br>
                              • <span style="color: #16a34a;">✓ Sin diferencias detectadas</span><br><br>
                              <strong style="color: #16a34a;">✓ El inventario se cerrará automáticamente</strong><br>
                              No requiere revisión adicional.`;
                    headerTexto = 'Confirmar Finalización - Cierre Automático';
                    severityIcon = 'pi pi-check-circle';
                }

                // Mostrar confirmación
                this.confirmationService.confirm({
                    message: mensaje,
                    header: headerTexto,
                    icon: severityIcon,
                    acceptLabel: 'Sí, finalizar',
                    rejectLabel: 'Cancelar',
                    acceptButtonStyleClass: hayDiferencias ? 'p-button-danger' : 'p-button-success',
                    accept: () => {
                        this.cerrarInventario();
                    }
                });
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al sincronizar inventario');
            }
        });
    }

    /**
     * Verificar si hay productos con diferencias en el inventario actual.
     * @returns true si hay al menos un producto con diferencia diferente de cero
     */
    private verificarDiferencias(): boolean {
        if (!this.inventarioActual || !this.inventarioActual.detalle) {
            return false;
        }

        return this.inventarioActual.detalle.some(detalle => {
            return detalle.nDiferencia !== null && 
                   detalle.nDiferencia !== undefined && 
                   detalle.nDiferencia !== 0;
        });
    }

    /**
     * Cerrar inventario (pasar a revisión o cerrar automáticamente).
     */
    private cerrarInventario(): void {
        if (!this.inventarioActual) return;

        // Verificar si hay diferencias antes de cerrar
        const hayDiferencias = this.verificarDiferencias();

        this.cargando = true;
        this.inventarioService.cerrarInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.cargando = false;
                this.inventarioActual = null; // Limpiamos para permitir nuevo inventario
                
                // Mostrar mensaje según el resultado
                if (hayDiferencias) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Inventario finalizado',
                        detail: `El inventario #${data.nId} se cerró correctamente y está EN REVISIÓN. Un administrador deberá revisar las diferencias.`
                    });
                } else {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Inventario cerrado automáticamente',
                        detail: `El inventario #${data.nId} se cerró y aplicó correctamente. No se detectaron diferencias.`,
                        life: 6000
                    });
                }
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError(err.error?.mensaje || 'Error al cerrar inventario');
            }
        });
    }

    /**
     * Recargar inventario completo.
     */
    recargarInventario(): void {
        if (!this.inventarioActual) return;

        this.inventarioService.obtenerInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.inventarioActual = data;
                this.actualizarMenu(); // Actualizar menú con nuevo estado
            },
            error: (err) => {
                this.mostrarError('Error al recargar inventario');
            }
        });
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
     * Obtener clase de badge según estatus.
     */
    getEstatusSeverity(estatus: number): string {
        switch (estatus) {
            case EstatusInventario.ABIERTO: return 'success';
            case EstatusInventario.PAUSADO: return 'warning';
            case EstatusInventario.EN_REVISION: return 'info';
            case EstatusInventario.AUTORIZADO: return 'success';
            case EstatusInventario.APLICADO: return 'success';
            default: return 'secondary';
        }
    }

    /**
     * Calcular dinámicamente el total de líneas desde el detalle.
     */
    get totalLineas(): number {
        return this.inventarioActual?.detalle?.length || 0;
    }

    /**
     * Calcular dinámicamente las líneas pendientes de contar desde el detalle.
     */
    get lineasPendientes(): number {
        if (!this.inventarioActual?.detalle) return 0;
        return this.inventarioActual.detalle.filter(d => 
            d.nCantidadContada === null || d.nCantidadContada === undefined
        ).length;
    }

    /**
     * Calcular dinámicamente las líneas ya contadas desde el detalle.
     */
    get lineasContadas(): number {
        if (!this.inventarioActual?.detalle) return 0;
        return this.inventarioActual.detalle.filter(d => 
            d.nCantidadContada !== null && d.nCantidadContada !== undefined
        ).length;
    }

    /**
     * Calcular dinámicamente las líneas con diferencias desde el detalle.
     */
    get lineasRecontar(): number {
        if (!this.inventarioActual?.detalle) return 0;
        return this.inventarioActual.detalle.filter(d => 
            d.nDiferencia !== null && d.nDiferencia !== undefined && d.nDiferencia !== 0
        ).length;
    }

    /**
     * Verificar si el inventario está editable.
     */
    get esEditable(): boolean {
        return this.inventarioActual?.nEstatus === EstatusInventario.ABIERTO;
    }
}

import { Component, OnInit } from '@angular/core';
import { MessageService, MenuItem } from 'primeng/api';
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
    providers: [MessageService]
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

    constructor(
        private inventarioService: InventarioUbicacionService,
        private bodegasService: BodegasService,
        private anaquelService: AnaquelService,
        private nivelService: NivelService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.cargarCatalogos();
        this.verificarInventarioAbierto();
        this.configurarMenu();
    }

    configurarMenu(): void {
        this.items = [
            {
                label: 'Acciones de Inventario',
                items: [
                    {
                        label: 'Sincronizar',
                        icon: 'pi pi-refresh',
                        command: () => this.sincronizarAutomatico()
                    },
                    {
                        label: 'Pausar',
                        icon: 'pi pi-pause',
                        command: () => this.pausarInventario()
                    },
                    {
                        label: 'Reanudar',
                        icon: 'pi pi-play',
                        command: () => this.reanudarInventario()
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Finalizar Inventario',
                        icon: 'pi pi-check-square',
                        command: () => this.cerrarInventario()
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
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sincronización exitosa',
                    detail: 'Inventario actualizado con los datos más recientes'
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
     * Cerrar inventario (pasar a revisión).
     */
    cerrarInventario(): void {
        if (!this.inventarioActual) return;

        if (this.inventarioActual.lineasPendientes! > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'No se puede cerrar',
                detail: `Hay ${this.inventarioActual.lineasPendientes} línea(s) pendiente(s) de contar`
            });
            return;
        }

        this.cargando = true;
        this.inventarioService.cerrarInventario(this.inventarioActual.nId!).subscribe({
            next: (data) => {
                this.cargando = false;
                this.inventarioActual = null; // Limpiamos para permitir nuevo inventario
                this.messageService.add({
                    severity: 'success',
                    summary: 'Inventario cerrado',
                    detail: `El inventario #${data.nId} se finalizó correctamente`
                });
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
     * Verificar si el inventario está editable.
     */
    get esEditable(): boolean {
        return this.inventarioActual?.nEstatus === EstatusInventario.ABIERTO;
    }
}

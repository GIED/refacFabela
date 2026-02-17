import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { InventarioUbicacionService } from '../../service/inventario-ubicacion.service';
import {
    InventarioUbicacionDto,
    InventarioUbicacionDetalleDto
} from '../../model/InventarioUbicacionDto';
import { EstatusInventario, DESCRIPCION_ESTATUS_INVENTARIO } from '../../model/InventarioEnums';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { AnaquelService } from 'src/app/shared/service/anaquel.service';
import { NivelService } from 'src/app/shared/service/nivel.service';
import { TcBodega } from 'src/app/productos/model/TcBodega';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';
import { TcNivel } from 'src/app/productos/model/TcNivel';
import { TcProducto } from 'src/app/productos/model/TcProducto';

@Component({
    selector: 'app-consulta-inventario',
    templateUrl: './consulta-inventario.component.html',
    styleUrls: ['./consulta-inventario.component.scss'],
    providers: [MessageService]
})
export class ConsultaInventarioComponent implements OnInit {

    // Modo de búsqueda: null = sin seleccionar, 'ubicacion' = por ubicación, 'producto' = por número de parte
    modoBusqueda: 'ubicacion' | 'producto' | null = null;

    // Catálogos
    bodegas: TcBodega[] = [];
    anaqueles: TcAnaquel[] = [];
    niveles: TcNivel[] = [];

    // Filtros seleccionados
    bodegaSeleccionada: TcBodega | null = null;
    anaquelSeleccionado: TcAnaquel | null = null;
    nivelSeleccionado: TcNivel | null = null;

    // Resultados
    inventarios: InventarioUbicacionDto[] = [];
    inventarioSeleccionado: InventarioUbicacionDto | null = null;

    // Detalle del inventario
    todosProductos: InventarioUbicacionDetalleDto[] = [];
    productosDiferencias: InventarioUbicacionDetalleDto[] = [];
    productosAjustados: InventarioUbicacionDetalleDto[] = [];

    // Controles
    cargando = false;
    cargandoCatalogos = false;
    mostrarDialogoDetalle = false;
    busquedaRealizada = false;
    tabActivo = 0;

    // Filtro de estatus
    estatusFiltro: number | null = null;
    opcionesEstatus = [
        { label: 'Todos', value: null },
        { label: 'Abierto', value: EstatusInventario.ABIERTO },
        { label: 'Pausado', value: EstatusInventario.PAUSADO },
        { label: 'En Revisión', value: EstatusInventario.EN_REVISION },
        { label: 'Autorizado', value: EstatusInventario.AUTORIZADO },
        { label: 'Aplicado', value: EstatusInventario.APLICADO },
        { label: 'Cancelado', value: EstatusInventario.CANCELADO }
    ];

    // Constantes
    EstatusInventario = EstatusInventario;
    DESCRIPCION_ESTATUS = DESCRIPCION_ESTATUS_INVENTARIO;

    // Filtro global en tabla de detalle
    filtroProducto = '';

    // Búsqueda por producto
    productoSeleccionado: TcProducto | null = null;
    inventariosProducto: InventarioUbicacionDto[] = [];
    busquedaProductoRealizada = false;
    cargandoProducto = false;

    constructor(
        private inventarioService: InventarioUbicacionService,
        private bodegasService: BodegasService,
        private anaquelService: AnaquelService,
        private nivelService: NivelService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.detectarMobile();
        this.cargarCatalogos();
    }

    /**
     * Detectar si es dispositivo móvil o tablet para ajustar comportamiento de dropdowns.
     */
    detectarMobile(): void {
        this.esMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                        || ('ontouchstart' in window) 
                        || (window.innerWidth < 1024);
    }

    /**
     * Cargar catálogos de ubicación.
     */
    cargarCatalogos(): void {
        this.cargandoCatalogos = true;
        this.bodegasService.obtenerBodegas().subscribe({
            next: (data) => {
                this.bodegas = data;
                this.cargandoCatalogos = false;
            },
            error: () => {
                this.cargandoCatalogos = false;
                this.mostrarError('Error al cargar bodegas');
            }
        });
        this.anaquelService.obtenerAnanquel().subscribe({
            next: (data) => this.anaqueles = data,
            error: () => this.mostrarError('Error al cargar anaqueles')
        });
        this.nivelService.obtenerNivel().subscribe({
            next: (data) => this.niveles = data,
            error: () => this.mostrarError('Error al cargar niveles')
        });
    }

    /**
     * Buscar inventarios según los filtros de ubicación.
     */
    buscarInventarios(): void {
        this.cargando = true;
        this.busquedaRealizada = true;
        this.inventarioSeleccionado = null;

        const nIdBodega = this.bodegaSeleccionada ? this.bodegaSeleccionada.nId : undefined;
        const nIdAnaquel = this.anaquelSeleccionado ? this.anaquelSeleccionado.nId : undefined;
        const nIdNivel = this.nivelSeleccionado ? this.nivelSeleccionado.nId : undefined;

        this.inventarioService.consultarInventariosPorUbicacion(nIdBodega, nIdAnaquel, nIdNivel).subscribe({
            next: (data) => {
                this.inventarios = data;
                this.cargando = false;
                if (data.length === 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sin resultados',
                        detail: 'No se encontraron inventarios para la ubicación seleccionada'
                    });
                }
            },
            error: (err) => {
                this.cargando = false;
                this.mostrarError('Error al consultar inventarios');
            }
        });
    }

    /**
     * Limpiar filtros y resultados.
     */
    limpiarFiltros(): void {
        this.bodegaSeleccionada = null;
        this.anaquelSeleccionado = null;
        this.nivelSeleccionado = null;
        this.estatusFiltro = null;
        this.inventarios = [];
        this.inventarioSeleccionado = null;
        this.busquedaRealizada = false;
    }

    /**
     * Ver detalle completo de un inventario.
     */
    verDetalleInventario(inventario: InventarioUbicacionDto): void {
        this.cargando = true;
        this.inventarioService.obtenerInventario(inventario.nId!).subscribe({
            next: (data) => {
                this.inventarioSeleccionado = data;

                // Todos los productos
                this.todosProductos = data.detalle || [];

                // Filtrar productos con diferencias
                this.productosDiferencias = this.todosProductos.filter(
                    item => item.nCantidadContada != null && item.nDiferencia !== 0
                );

                // Productos ajustados
                this.productosAjustados = this.todosProductos.filter(
                    item => item.bAjustado === true
                );

                this.tabActivo = 0;
                this.cargando = false;
                this.mostrarDialogoDetalle = true;
            },
            error: () => {
                this.cargando = false;
                this.mostrarError('Error al cargar detalle del inventario');
            }
        });
    }

    /**
     * Obtener inventarios filtrados por estatus (filtro local).
     */
    get inventariosFiltrados(): InventarioUbicacionDto[] {
        if (this.estatusFiltro == null) {
            return this.inventarios;
        }
        return this.inventarios.filter(i => i.nEstatus === this.estatusFiltro);
    }

    /**
     * Obtener productos filtrados por texto (filtro local en diálogo).
     */
    get productosFiltrados(): InventarioUbicacionDetalleDto[] {
        if (!this.filtroProducto || this.filtroProducto.trim() === '') {
            return this.todosProductos;
        }
        const filtro = this.filtroProducto.toLowerCase();
        return this.todosProductos.filter(p =>
            (p.sNoParte && p.sNoParte.toLowerCase().includes(filtro)) ||
            (p.sNombreProducto && p.sNombreProducto.toLowerCase().includes(filtro)) ||
            (p.sMarca && p.sMarca.toLowerCase().includes(filtro))
        );
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

    get totalAjustados(): number {
        return this.productosAjustados.length;
    }

    /**
     * Obtener cantidad de productos con diferencias (para la tabla principal).
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
     * Obtener cantidad de productos ajustados (para la tabla principal).
     */
    obtenerCantidadAjustados(inventario: InventarioUbicacionDto): number {
        if (!inventario.detalle || inventario.detalle.length === 0) {
            return 0;
        }
        return inventario.detalle.filter(item => item.bAjustado === true).length;
    }

    /**
     * Obtener la descripción de la ubicación formateada.
     */
    getUbicacionTexto(): string {
        const partes: string[] = [];
        if (this.bodegaSeleccionada) { partes.push(this.bodegaSeleccionada.sBodega); }
        if (this.anaquelSeleccionado) { partes.push(this.anaquelSeleccionado.sAnaquel); }
        if (this.nivelSeleccionado) { partes.push(this.nivelSeleccionado.sNivel); }
        return partes.length > 0 ? partes.join(' > ') : 'Todas las ubicaciones';
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

    /**
     * Obtener icono según estatus.
     */
    getEstatusIcon(estatus: number): string {
        switch (estatus) {
            case EstatusInventario.ABIERTO: return 'pi pi-lock-open';
            case EstatusInventario.PAUSADO: return 'pi pi-pause';
            case EstatusInventario.EN_REVISION: return 'pi pi-clock';
            case EstatusInventario.AUTORIZADO: return 'pi pi-check-circle';
            case EstatusInventario.APLICADO: return 'pi pi-check-square';
            case EstatusInventario.CANCELADO: return 'pi pi-times-circle';
            default: return 'pi pi-question-circle';
        }
    }

    /**
     * Buscar inventarios por número de parte (producto seleccionado desde input-busqueda).
     */
    buscarPorProducto(nIdProducto: number): void {
        this.cargandoProducto = true;
        this.busquedaProductoRealizada = true;
        this.inventariosProducto = [];

        this.inventarioService.consultarInventariosPorProducto(nIdProducto).subscribe({
            next: (data) => {
                this.inventariosProducto = data;
                this.cargandoProducto = false;
                if (data.length === 0) {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Sin resultados',
                        detail: 'No se encontraron inventarios para este producto'
                    });
                }
            },
            error: () => {
                this.cargandoProducto = false;
                this.mostrarError('Error al consultar inventarios por producto');
            }
        });
    }

    /**
     * Manejador del evento de producto seleccionado en input-busqueda.
     */
    onProductoSeleccionado(producto: TcProducto): void {
        this.productoSeleccionado = producto;
    }

    /**
     * Obtener inventarios de producto filtrados por estatus.
     */
    get inventariosProductoFiltrados(): InventarioUbicacionDto[] {
        if (this.estatusFiltroProducto == null) {
            return this.inventariosProducto;
        }
        return this.inventariosProducto.filter(i => i.nEstatus === this.estatusFiltroProducto);
    }

    // Filtro de estatus para búsqueda por producto
    estatusFiltroProducto: number | null = null;

    // Imágenes de productos
    rutaImagenDefault: string = 'assets/layout/images/default.png';
    imagenAmpliada: string | null = null;
    mostrarImagenAmpliada: boolean = false;

    // Detección de dispositivo móvil/tablet para dropdowns
    esMobile: boolean = false;

    /**
     * Seleccionar modo de búsqueda.
     */
    seleccionarModo(modo: 'ubicacion' | 'producto'): void {
        this.modoBusqueda = modo;
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
     * Nueva búsqueda: resetea todo y vuelve a la selección de modo.
     */
    nuevaBusqueda(): void {
        this.modoBusqueda = null;

        // Limpiar búsqueda por ubicación
        this.bodegaSeleccionada = null;
        this.anaquelSeleccionado = null;
        this.nivelSeleccionado = null;
        this.estatusFiltro = null;
        this.inventarios = [];
        this.inventarioSeleccionado = null;
        this.busquedaRealizada = false;

        // Limpiar búsqueda por producto
        this.productoSeleccionado = null;
        this.inventariosProducto = [];
        this.busquedaProductoRealizada = false;
        this.estatusFiltroProducto = null;

        // Limpiar detalle
        this.todosProductos = [];
        this.productosDiferencias = [];
        this.productosAjustados = [];
        this.filtroProducto = '';
        this.mostrarDialogoDetalle = false;
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
}

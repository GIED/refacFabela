import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/service/token.service';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { CotizacionDto } from '../../model/dto/CotizacionDto';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductoService } from '../../../shared/service/producto.service';
import { MessageService } from 'primeng/api';
import { VentasCotizacionesService } from 'src/app/shared/service/ventas-cotizaciones.service';
import { TcCliente } from '../../../administracion/model/TcCliente';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { ProductoDescuentoDto } from 'src/app/productos/model/ProductoDescuentoDto';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-revendedor-ventas',
  templateUrl: './revendedor-ventas.component.html',
  styleUrls: ['./revendedor-ventas.component.scss']
})
export class RevendedorVentasComponent implements OnInit {

  formGrp: FormGroup;

  cliente: TcCliente = new TcCliente();
  productoSeleccionado: TcProducto;
  producto: string;

  listaProductoSugerencia: TcProducto[] = [];
  listaProductos: TvStockProducto[] = [];
  productosFiltrados: TvStockProducto[] = [];
  listaCotizacion: CotizacionDto[] = [];

  datosRegistraVenta: DatosVenta;
  cotizacionData: TwCotizacion;

  mostrarSugerenciasProducto: boolean = false;
  mostrarOpcionesVenta: boolean = false;
  muestraProductos: boolean = true;
  mostrarAlternativos: boolean = false;
  mostrarCredito: boolean = false;
  cargandoBusqueda: boolean = false;
  clienteCargado: boolean = false;
  mostrarCarritoMovil: boolean = false;

  // Diálogo de resultado de operación
  mostrarResultado: boolean = false;
  resultadoTipo: 'cotizacion' | 'venta' = 'cotizacion';
  resultadoIdCotizacion: number = null;
  resultadoIdVenta: number = null;

  saldoGeneralCliente: SaldoGeneralCliente;

  total: Decimal = new Decimal(0);
  nIdProducto: number;
  stockTotal: number = 0;

  // Mapa de imágenes resueltas por noParte
  imagenesProducto: Map<string, string> = new Map();
  // Default placeholder
  imagenDefault: string = 'assets/layout/images/no-image.png';

  constructor(
    private tokenService: TokenService,
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private messageService: MessageService,
    private ventasCotizacionService: VentasCotizacionesService,
    private ventaService: VentasService
  ) {
    this.saldoGeneralCliente = new SaldoGeneralCliente();
    this.listaProductos = [];
  }

  ngOnInit(): void {
    this.consultarCliente();
    this._initFormGroup();
  }

  _initFormGroup(): void {
    this.formGrp = new FormGroup({
      productoCtrl: new FormControl('', [Validators.minLength(3)]),
      productoSelecionadoCtrl: new FormControl('', []),
      nCantidadCtrl: new FormControl(0, [])
    });
  }

  get productoCtrl() {
    return this.formGrp.get('productoCtrl') as FormControl;
  }
  get productoSelecionadoCtrl() {
    return this.formGrp.get('productoSelecionadoCtrl') as FormControl;
  }
  get nCantidadCtrl() {
    return this.formGrp.get('nCantidadCtrl') as FormControl;
  }

  consultarCliente() {
    const nIdCliente = this.tokenService.getIdCliente();
    console.log('[revendedor-ventas] consultarCliente → nIdCliente from JWT:', nIdCliente);
    if (nIdCliente != null) {
      // Revendedor con cliente directamente asignado en JWT
      this.clienteService.consultaClienteId(nIdCliente).subscribe(resp => {
        console.log('[revendedor-ventas] consultaClienteId response:', resp);
        if (resp != null && resp.nId != null) {
          this.cliente = resp;
        } else {
          // consultaClienteId devolvió null (error de serialización en backend),
          // pero tenemos el ID desde el JWT — úsalo para cargar el saldo de todas formas
          this.cliente.nId = nIdCliente;
          console.warn('[revendedor-ventas] consultaClienteId devolvió null, usando nIdCliente del JWT:', nIdCliente);
        }
        this.clienteCargado = true;
        this.cargarSaldoCliente();
      }, () => {
        // Error HTTP — aun así intentar cargar el saldo con el ID del JWT
        this.cliente.nId = nIdCliente;
        this.clienteCargado = true;
        this.cargarSaldoCliente();
      });
    } else {
      // Fallback: buscar cliente por id de usuario (compatibilidad)
      this.clienteService.consultaClienteIdUsuario(this.tokenService.getIdUser()).subscribe(resp => {
        if (resp != null && resp.nId != null) {
          this.cliente = resp;
          this.clienteCargado = true;
          this.cargarSaldoCliente();
        } else {
          this.asignarClienteDefault();
        }
      }, () => {
        this.asignarClienteDefault();
      });
    }
  }

  private cargarSaldoCliente() {
    console.log('[revendedor-ventas] cargarSaldoCliente → cliente.nId:', this.cliente.nId);
    this.clienteService.obtenerSaldoGeneralCliente(this.cliente.nId).subscribe(saldoCliente => {
      console.log('[revendedor-ventas] obtenerSaldoGeneralCliente response:', saldoCliente);
      if (saldoCliente != null) {
        this.saldoGeneralCliente = saldoCliente;
      } else {
        this.saldoGeneralCliente.nIdCliente = this.cliente.nId;
        this.saldoGeneralCliente.nCreditoDisponible = this.cliente.n_limiteCredito;
        this.saldoGeneralCliente.nLimiteCredito = this.cliente.n_limiteCredito;
        this.saldoGeneralCliente.nSaldoTotal = new Decimal('0');
        this.saldoGeneralCliente.tcCliente = this.cliente;
      }
      this.mostrarCredito = true;
    }, (err) => {
      console.error('[revendedor-ventas] obtenerSaldoGeneralCliente error:', err);
      this.mostrarCredito = false;
    });
  }

  private asignarClienteDefault() {
    this.cliente = new TcCliente();
    this.cliente.nId = 988;
    this.cliente.sRazonSocial = 'ADMIN PRUEBAS (PUBLICO GENERAL)';
    this.clienteCargado = true;
    this.mostrarCredito = false;
    this.saldoGeneralCliente = null;
  }

  /**
   * Busca productos al dar click al botón de búsqueda.
   * Requiere mínimo 3 caracteres.
   */
  buscarProductos() {
    const valor = this.productoCtrl.value?.trim();
    if (!valor || valor.length < 3) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Ingrese al menos 3 caracteres para buscar', life: 3000 });
      return;
    }
    this.cargandoBusqueda = true;
    this.productosFiltrados = [];
    this.mostrarSugerenciasProducto = false;

    this.productoService.obtenerProductosLike(valor).subscribe(productos => {
      this.cargandoBusqueda = false;
      if (productos != null && productos.length !== 0) {
        this.listaProductoSugerencia = productos;
        // Para cada producto, obtener stock y precio con descuento
        for (const prod of productos) {
          this.resolverImagenProductoCard(prod);
          this.productoService.obtenerTotalBodegasIdProducto(prod.nId).subscribe(productoStock => {
            // Calcular precio con descuento del cliente si tiene cliente asociado
            if (this.clienteCargado && this.saldoGeneralCliente?.tcCliente) {
              const dto = new ProductoDescuentoDto();
              dto.tcProducto = prod;
              dto.tcCliente = this.saldoGeneralCliente.tcCliente;
              this.productoService.calcularPrecioProducto(dto).subscribe(productoConPrecio => {
                productoStock.tcProducto = productoConPrecio;
                this.productosFiltrados.push(productoStock);
              });
            } else {
              productoStock.tcProducto = prod;
              this.productosFiltrados.push(productoStock);
            }
          });
        }
        this.mostrarSugerenciasProducto = true;
        this.messageService.add({ severity: 'info', summary: 'Productos encontrados', detail: productos.length + ' coincidencias', life: 3000 });
      } else {
        this.mostrarSugerenciasProducto = false;
        this.messageService.add({ severity: 'warn', summary: 'Sin resultados', detail: 'No se encontraron productos, verifique la búsqueda.', life: 3000 });
      }
    }, () => {
      this.cargandoBusqueda = false;
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al buscar productos', life: 3000 });
    });
  }

  /**
   * Resuelve la URL de imagen para un producto y la guarda en el mapa
   */
  resolverImagenProductoCard(producto: TcProducto) {
    if (producto.sNoParte && !this.imagenesProducto.has(producto.sNoParte)) {
      this.productoService.resolverImagenProducto(producto.sNoParte).subscribe(
        resp => {
          if (resp && resp.url) {
            this.imagenesProducto.set(producto.sNoParte, resp.url);
          }
        },
        () => { /* si falla, se usa placeholder */ }
      );
    }
  }

  getImagenProducto(noParte: string): string {
    return this.imagenesProducto.get(noParte) || this.imagenDefault;
  }

  /**
   * Muestra los productos alternativos de un producto
   */
  muestraAlternativo(producto: TvStockProducto) {
    this.nIdProducto = producto.nIdProducto;
    this.mostrarAlternativos = true;
  }

  cerrarAlternativos() {
    this.mostrarAlternativos = false;
  }

  /**
   * Agrega un producto alternativo al carrito (emitido desde el componente hijo)
   */
  agregarProductoAlternativo(producto: TvStockProducto) {
    this.agregarAlCarrito(producto, producto.nCantidad || 1);
    this.mostrarAlternativos = false;
  }

  /**
   * Agrega un producto al carrito desde las cards
   */
  agregarProductoDesdeCard(producto: TvStockProducto, cantidad: number) {
    if (!cantidad || cantidad <= 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000 });
      return;
    }
    this.agregarAlCarrito(producto, cantidad);
  }

  /**
   * Lógica centralizada para agregar al carrito
   */
  private agregarAlCarrito(producto: TvStockProducto, cantidad: number) {
    if (cantidad === 0) {
      this.messageService.add({ severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000 });
      return;
    }

    if (producto.nCantidadTotal < cantidad) {
      this.messageService.add({ severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la compra', life: 3000 });
      return;
    }

    // Verificar si ya existe en el carrito
    const idx = this.findIndexById(producto.nIdProducto, this.listaProductos);
    if (idx !== -1) {
      // Ya existe → actualizar cantidad
      const cantidadAnterior = this.listaProductos[idx].nCantidad;
      const nuevaCantidad = cantidadAnterior + cantidad;
      if (nuevaCantidad > producto.nCantidadTotal) {
        this.messageService.add({ severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para la cantidad total', life: 3000 });
        return;
      }
      this.listaProductos[idx].nCantidad = nuevaCantidad;
      // Recalcular totales de la partida
      const precio = new Decimal(producto.tcProducto.nPrecioSinIva.toString());
      const cantDec = new Decimal(nuevaCantidad.toString());
      const { totalFinal, precioUnitario } = this.calcularTotales(precio, cantDec);
      this.listaProductos[idx].nTotalUnitario = precioUnitario;
      this.listaProductos[idx].nTotalPartida = totalFinal;
    } else {
      // No existe → agregar nuevo
      const productoCarrito = { ...producto };
      productoCarrito.nCantidad = cantidad;
      // Calcular totales de la partida
      const precio = new Decimal(producto.tcProducto.nPrecioSinIva.toString());
      const cantDec = new Decimal(cantidad.toString());
      const { totalFinal, precioUnitario } = this.calcularTotales(precio, cantDec);
      productoCarrito.nTotalUnitario = precioUnitario;
      productoCarrito.nTotalPartida = totalFinal;
      this.listaProductos.push(productoCarrito);
    }

    this.total = this.calculaTotalCarrito();
    producto.nCantidadTotal = producto.nCantidadTotal - cantidad;

    this.messageService.add({ severity: 'success', summary: 'Agregado', detail: 'Producto agregado al carrito', life: 3000 });
  }

  quitarProducto(producto: TvStockProducto) {
    this.listaProductos.splice(this.findIndexById(producto.nIdProducto, this.listaProductos), 1);
    this.total = this.calculaTotalCarrito();

    // Restaurar stock en la lista filtrada
    const idxFiltrado = this.findIndexById(producto.nIdProducto, this.productosFiltrados);
    if (idxFiltrado !== -1) {
      this.productosFiltrados[idxFiltrado].nCantidadTotal += producto.nCantidad;
    }
  }

  /**
   * Guarda cotización y muestra diálogo de opciones de venta
   */
  guardarCotizacion() {
    const productoCotizado: CotizacionDto[] = [];
    const folio = this.createFolio();

    for (const producto of this.listaProductos) {
      const cotizacionDto = new CotizacionDto();
      cotizacionDto.nIdCliente = this.cliente.nId;
      cotizacionDto.nIdUsuario = this.tokenService.getIdUser();
      cotizacionDto.sFolio = folio;
      cotizacionDto.nIdProducto = producto.nIdProducto;
      cotizacionDto.nCantidad = producto.nCantidad;
      cotizacionDto.nPrecioUnitario = producto.tcProducto.nPrecioSinIva;
      cotizacionDto.nIvaUnitario = new Decimal(producto.tcProducto.nPrecioConIva).minus(new Decimal(producto.tcProducto.nPrecioSinIva));
      cotizacionDto.nTotalUnitario = producto.tcProducto.nPrecioConIva;

      productoCotizado.push(JSON.parse(JSON.stringify(cotizacionDto)));
    }

    this.listaCotizacion = productoCotizado;

    this.ventasCotizacionService.guardaCotizacion(this.listaCotizacion).subscribe(cotizacionRegistrada => {
      if (cotizacionRegistrada.nId !== null) {
        this.cotizacionData = cotizacionRegistrada;
        console.log('[revendedor-ventas] Abriendo diálogo. saldoGeneralCliente:', this.saldoGeneralCliente,
                    '| cliente.nId:', this.cliente?.nId, '| total:', this.total?.toString());
        this.mostrarOpcionesVenta = true;
      }
    });
  }

  generarCotizacionPdf(idCotizacion: number) {
    this.ventasCotizacionService.generarCotizacionPdf(idCotizacion).subscribe(resp => {
      const file = new Blob([resp], { type: 'application/pdf' });
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'cotizacion_' + idCotizacion + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Cotización generada', life: 3000 });
      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la cotización', life: 3000 });
      }
    });
  }

  /**
   * Genera la venta (emitido desde el componente form-venta del revendedor)
   */
  generarVenta(datosVenta: DatosVenta) {
    this.datosRegistraVenta = datosVenta;
    this.datosRegistraVenta.idCliente = this.cliente.nId;
    this.datosRegistraVenta.idUsuario = this.tokenService.getIdUser();
    this.datosRegistraVenta.sFolioVenta = this.createFolio();
    this.datosRegistraVenta.idTipoVenta = 1;

    if (this.datosRegistraVenta.tipoPago === 1) {
      this.datosRegistraVenta.fechaIniCredito = new Date();
      const fin = new Date();
      fin.setDate(fin.getDate() + 30);
      this.datosRegistraVenta.fechaFinCredito = fin;
    } else {
      this.datosRegistraVenta.fechaIniCredito = null;
      this.datosRegistraVenta.fechaFinCredito = null;
    }

    this.datosRegistraVenta.twCotizacion = this.cotizacionData;

    this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(venta => {
      this.generarVentaPdf(venta.nId);
    });
  }

  generarVentaPdf(idVenta: number) {
    this.resultadoTipo = 'venta';
    this.resultadoIdVenta = idVenta;
    this.resultadoIdCotizacion = this.cotizacionData?.nId || null;
    this.mostrarOpcionesVenta = false;
    this.mostrarResultado = true;
    this.limpiaFormulario();
  }

  descargarResultado() {
    if (this.resultadoTipo === 'venta' && this.resultadoIdVenta) {
      this.ventaService.generarVentaPdf(this.resultadoIdVenta).subscribe(resp => {
        const file = new Blob([resp], { type: 'application/pdf' });
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'venta_' + this.resultadoIdVenta + '.pdf';
          anchor.href = fileURL;
          anchor.click();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000 });
        }
      });
    } else if (this.resultadoTipo === 'cotizacion' && this.resultadoIdCotizacion) {
      this.ventasCotizacionService.generarCotizacionPdf(this.resultadoIdCotizacion).subscribe(resp => {
        const file = new Blob([resp], { type: 'application/pdf' });
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'cotizacion_' + this.resultadoIdCotizacion + '.pdf';
          anchor.href = fileURL;
          anchor.click();
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar la cotización', life: 3000 });
        }
      });
    }
  }

  cerrarResultado() {
    this.mostrarResultado = false;
    this.resultadoIdCotizacion = null;
    this.resultadoIdVenta = null;
    this.cargarSaldoCliente();
  }

  soloCotizacion() {
    if (this.cotizacionData && this.cotizacionData.nId) {
      this.resultadoTipo = 'cotizacion';
      this.resultadoIdCotizacion = this.cotizacionData.nId;
      this.resultadoIdVenta = null;
      this.mostrarOpcionesVenta = false;
      this.mostrarResultado = true;
      this.limpiaFormulario();
    }
  }

  limpiaFormulario() {
    this.productoCtrl.setValue('');
    this.productoSelecionadoCtrl.setValue('');
    this.nCantidadCtrl.setValue(0);
    this.listaProductos = [];
    this.productosFiltrados = [];
    this.listaCotizacion = [];
    this.cotizacionData = null;
    this.datosRegistraVenta = null;
    this.total = new Decimal('0');
    this.mostrarOpcionesVenta = false;
    this.mostrarSugerenciasProducto = false;
  }

  limpiarBusqueda() {
    this.productoCtrl.setValue('');
    this.productosFiltrados = [];
    this.mostrarSugerenciasProducto = false;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = this.imagenDefault;
  }

  /**
   * Manejo de tecla Enter en el campo de búsqueda
   */
  onBusquedaKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.buscarProductos();
    }
  }

  // Cálculo de totales con IVA y truncamiento (misma lógica que ventas)
  private calcularTotales(precio: Decimal, cantidad: Decimal) {
    const iva = new Decimal('0.16');
    const subtotal = precio.mul(cantidad);
    const montoIva = subtotal.mul(iva);
    const totalConIva = subtotal.plus(montoIva);
    return {
      subtotalFinal: subtotal.toDecimalPlaces(2, Decimal.ROUND_DOWN),
      ivaFinal: montoIva.toDecimalPlaces(2, Decimal.ROUND_DOWN),
      totalFinal: totalConIva.toDecimalPlaces(2, Decimal.ROUND_DOWN),
      precioUnitario: precio.plus(precio.mul(iva)).toDecimalPlaces(2, Decimal.ROUND_DOWN)
    };
  }

  // Suma de todas las partidas del carrito (misma lógica que ventas)
  calculaTotalCarrito(): Decimal {
    return this.listaProductos.reduce((acumulado, item) => {
      return acumulado.plus(new Decimal(item.nTotalPartida.toString()));
    }, new Decimal(0)).toDecimalPlaces(2, Decimal.ROUND_DOWN);
  }

  findIndexById(id: number, arreglo: TvStockProducto[]): number {
    let index = -1;
    for (let i = 0; i < arreglo.length; i++) {
      if (arreglo[i].nIdProducto === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  createFolio(): string {
    let folio = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      folio += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return folio;
  }
}

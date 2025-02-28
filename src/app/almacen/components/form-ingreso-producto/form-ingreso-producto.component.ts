import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';
import { TcBodega } from 'src/app/productos/model/TcBodega';
import { TcNivel } from 'src/app/productos/model/TcNivel';
import { TwFacturaProveedorProductoIngreso } from 'src/app/productos/model/TwFacturaProveedorProductoIngreso ';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { AnaquelService } from 'src/app/shared/service/anaquel.service';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { ComprasService } from 'src/app/shared/service/compras.service';
import { FechaService } from 'src/app/shared/service/fecha.service';
import { NivelService } from 'src/app/shared/service/nivel.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TwFacturaProveedorProducto } from 'src/app/shared/service/TwFacturaProveedorProducto';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

/**
 * Componente para el formulario de ingreso de productos.
 */
@Component({
  selector: 'app-form-ingreso-producto',
  templateUrl: './form-ingreso-producto.component.html',
  styleUrls: ['./form-ingreso-producto.component.scss']
})
export class FormIngresoProductoComponent implements OnInit {
  twFacturaProveedorProducto = new TwFacturaProveedorProducto();
  modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
  formGrp: FormGroup;
  listaProductoBodega: TwProductoBodega[] = [];
  listaBodegas: TcBodega[] = [];
  listaAnaquel: TcAnaquel[] = [];
  listaNivel: TcNivel[] = [];
  listaIngresoProductoFactura: TwFacturaProveedorProductoIngreso[] = [];
  totalIngresado = 0;
  totalPendiente = 0;
  twFacturaProveedorProductoIngreso = new TwFacturaProveedorProductoIngreso();

  constructor(
    private comprasService: ComprasService,
    public ref: DynamicDialogRef,
    public productoService: ProductoService,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private bodegasService: BodegasService,
    private anaquelService: AnaquelService,
    private nivelService: NivelService,
    private fechaService: FechaService,
    private tokenService: TokenService
  ) {
    this.formGrp = new FormGroup({});
  }

  /**
   * Inicializa el componente y carga los datos iniciales.
   */
  ngOnInit(): void {
    const modelContainer: ModelContainer = this.config.data;
    this.twFacturaProveedorProducto = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwFacturaProveedorProducto() : modelContainer.modelData as TwFacturaProveedorProducto;

    if (this.twFacturaProveedorProducto) {
      this.mostrarDistribucionBodegas(this.twFacturaProveedorProducto);
      this.createFormGroup();
      this.loadInitialData();
      this.obtenerIngresosProductoFactura(this.twFacturaProveedorProducto.nId).subscribe();
    }
  }

  /**
   * Carga los datos iniciales necesarios para el formulario.
   */
  private loadInitialData(): void {
    this.bodegasService.obtenerBodegas().subscribe(bodegas => this.listaBodegas = bodegas);
    this.anaquelService.obtenerAnanquel().subscribe(anaquel => this.listaAnaquel = anaquel);
    this.nivelService.obtenerNivel().subscribe(nivel => this.listaNivel = nivel);
  }

  /**
   * Muestra la distribución de productos en las bodegas.
   * @param twFacturaProveedorProducto - Producto del proveedor.
   */
  mostrarDistribucionBodegas(twFacturaProveedorProducto: TwFacturaProveedorProducto): void {
    this.bodegasService.obtenerProductoBodegas(twFacturaProveedorProducto.nIdProducto).subscribe(data => this.listaProductoBodega = data);
  }

  /**
   * Maneja el evento de envío del formulario.
   */
  onSubmit(): void {
    if (!this.formGrp.valid) {
      return;
    }
  
    const { bodega, cantidad, anaquel, nivel } = this.formGrp.controls;
    const productoBodega = this.buscarProductoBodega(bodega.value);
  
    if (productoBodega) {
      productoBodega.nCantidad += cantidad.value;
    }

   
    
  
    this.twFacturaProveedorProductoIngreso = {
      ...this.twFacturaProveedorProductoIngreso,
      nCantidad: cantidad.value,
      dFechaIngreso: this.fechaService.obtenerFechaActualMexicoCentro(),
      nIdUsuario: this.tokenService.getIdUser(),
      nIdFacturaProveedorProducto: this.twFacturaProveedorProducto.nId,
      nEstatus: 0,
      nIdBodega: bodega.value ?? productoBodega?.nIdBodega,
      nIdAnaquel: anaquel.value ?? productoBodega?.nIdAnaquel,
      nIdNivel: nivel.value ?? productoBodega?.nIdNivel
    };  
    
    productoBodega.nIdAnaquel=  this.twFacturaProveedorProductoIngreso.nIdAnaquel;
    productoBodega.nIdBodega=this.twFacturaProveedorProductoIngreso.nIdBodega;
    productoBodega.nIdNivel=this.twFacturaProveedorProductoIngreso.nIdNivel;
     
    console.log('Este es el objeto qie voy a guardar de producto bodega', productoBodega );

  
    this.productoService.guardaProductoBodega(productoBodega).pipe(
      switchMap(prodbodega => {
        this.mostrarDistribucionBodegas(this.twFacturaProveedorProducto);
        return this.comprasService.saveProductoFacturaIngreso(this.twFacturaProveedorProductoIngreso);
      }),
      switchMap(ingreso => {
        this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Guardado con éxito', life: 3000 });
        this.twFacturaProveedorProductoIngreso = ingreso;
        return this.obtenerIngresosProductoFactura(this.twFacturaProveedorProducto.nId);
      })
    ).subscribe({
      next: () => {
        this.formGrp.reset(); // Limpiar el formulario
        this.twFacturaProveedorProductoIngreso = new TwFacturaProveedorProductoIngreso();
        if (this.totalPendiente === 0) {        
          this.twFacturaProveedorProducto.nEstatus=1;
         this.comprasService.saveProductoFactura(this.twFacturaProveedorProducto).subscribe(prductoFactura=>{
          this.twFacturaProveedorProducto=prductoFactura;  
          this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Ingreso completado', life: 3000 });
           this.ref.close();
        })




        }
      },
      error: err => {
        console.error('Error en el proceso de ingreso del producto:', err);
      }
    });
  }

  /**
   * Crea el grupo de controles del formulario.
   */
  private createFormGroup(): void {
    this.formGrp = new FormGroup({
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      bodega: new FormControl(null, [Validators.required]),
      anaquel: new FormControl(null, [Validators.required]),
      nivel: new FormControl(null, [Validators.required]),
    });
  }

  /**
   * Valida el inventario de la bodega seleccionada.
   */
  validaInventarioBodega(): void {
    const productoBodega = this.buscarProductoBodega(this.formGrp.get('bodega')?.value);
    if (productoBodega && productoBodega.nCantidad > 0) {
      this.formGrp.patchValue({
        anaquel: productoBodega.nIdAnaquel,
        nivel: productoBodega.nIdNivel
      });
      this.formGrp.get('anaquel')?.disable();
      this.formGrp.get('nivel')?.disable();
    } else {
      this.formGrp.get('anaquel')?.enable();
      this.formGrp.get('nivel')?.enable();
      this.formGrp.patchValue({
        anaquel: productoBodega?.nIdAnaquel,
        nivel: productoBodega?.nIdNivel
      });
    }
  }

  /**
   * Busca un producto en la bodega seleccionada.
   * @param bodegaSeleccionada - ID de la bodega seleccionada.
   * @returns El producto encontrado o null si no se encuentra.
   */
  private buscarProductoBodega(bodegaSeleccionada: number): TwProductoBodega | null {
    return this.listaProductoBodega.find(producto => producto.nIdBodega === bodegaSeleccionada) || null;
  }

  /**
   * Obtiene los ingresos de productos para la factura seleccionada.
   * @param nId - ID de la factura.
   * @returns Observable de la lista de ingresos de productos.
   */
  private obtenerIngresosProductoFactura(nId: number): Observable<TwFacturaProveedorProductoIngreso[]> {
    console.log('entre a consultar las bodegas');
    return this.comprasService.getProductoFacturaIngreso(nId).pipe(
      tap(ingreso => {
        this.listaIngresoProductoFactura = ingreso || []; // Asignar una lista vacía si ingreso es null o undefined
        console.log('voy a ir consultar los totales');
        this.calcularTotalesIngreso(this.listaIngresoProductoFactura);
      })
    );
  }

  /**
   * Calcula los totales de ingreso y pendiente de productos.
   * @param listaProductoIngreso - Lista de ingresos de productos.
   */
  calcularTotalesIngreso(listaProductoIngreso: TwFacturaProveedorProductoIngreso[]): void {
    this.totalIngresado = listaProductoIngreso.reduce((total, producto) => total + producto.nCantidad, 0);
    this.totalPendiente = this.twFacturaProveedorProducto.nCantidad - this.totalIngresado;
    console.log(this.totalIngresado);
    console.log(this.totalPendiente);
  }

  get cantidad(): FormControl {
    return this.formGrp.get('cantidad') as FormControl;
  }
  get anaquel(): FormControl {
    return this.formGrp.get('anaquel') as FormControl;
  }
  get nivel(): FormControl {
    return this.formGrp.get('nivel') as FormControl;
  }
  get bodega(): FormControl {
    return this.formGrp.get('bodega') as FormControl;
  }
}
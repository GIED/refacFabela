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
import { concatMap, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { PedidosService } from '../../../shared/service/pedidos.service';
import { TwPedidoProducto } from 'src/app/productos/model/TwPedidoProducto';

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
  totalBodegas:number=0;
  totalRecibida:number=0;
  ingresoPartida:number = 0;
  listaProductoPedido:TwPedidoProducto[]=[];
  totalProductoPendiente:number=0;

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
    private tokenService: TokenService,
    private pedidosService:PedidosService
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
      this.productosPedido(this.twFacturaProveedorProducto.nIdProducto);
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

calcularTotalBodegas( listaProductoBodega:TwProductoBodega[]){ 
  for (const producto of listaProductoBodega) {
  this.totalBodegas += producto.nCantidad;
  }
      console.log(this.totalBodegas, 'ESTE EL NUMERO TOTAL DE PRODUCTOS');
    }


  mostrarDistribucionBodegas(twFacturaProveedorProducto: TwFacturaProveedorProducto): void {
    this.bodegasService.obtenerProductoBodegas(twFacturaProveedorProducto.nIdProducto).subscribe(data => {this.listaProductoBodega = data     
      this.calcularTotalBodegas(this.listaProductoBodega);
    }
     

    );
  }

  /**
   * Maneja el evento de envío del formulario.
   */

  
  
productosPedido(ndProducto: number) {
this.pedidosService.obtenerProductosIdPedido(this.twFacturaProveedorProducto.nIdProducto).subscribe(data3 => {
  this.listaProductoPedido=data3;

    if( this.listaProductoPedido.length>0){
       this.confirmationService.confirm({
            message: '¡Hay ventas por pedido pendientes de ingresar, favor de separalas!',
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: "Aceptar", acceptIcon: "pi pi-check", acceptButtonStyleClass: 'p-button-success p-button-sm p-button-raised',  
             rejectVisible: false, 
            blockScroll: true, // Evita que se pueda hacer scroll en el fondo 
            dismissableMask: false, 


            accept: () => {
            // Acción a ejecutar si el usuario acepta
            }
            });


    }




 this.totalProductoPendiente = data3.reduce((total, producto) => total + (producto.nCantidadPedida - producto.nCantidaRecibida), 0);
console.log('este el numero total de pendietes por entregar',this.totalProductoPendiente);
 });
}


  
  





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

    console.log( this.twFacturaProveedorProductoIngreso);
    
    productoBodega.nIdAnaquel=  this.twFacturaProveedorProductoIngreso.nIdAnaquel;
    productoBodega.nIdBodega=this.twFacturaProveedorProductoIngreso.nIdBodega;
    productoBodega.nIdNivel=this.twFacturaProveedorProductoIngreso.nIdNivel;
     
    



    this.productoService.guardaProductoBodega(productoBodega).pipe(
  tap(() => this.mostrarDistribucionBodegas(this.twFacturaProveedorProducto)),

  concatMap(() =>
    this.comprasService.saveProductoFacturaIngreso(this.twFacturaProveedorProductoIngreso)
  ),

  tap(ingreso => {
    this.messageService.add({
      severity: 'success',
      summary: 'Mensaje',
      detail: 'Guardado con éxito',
      life: 3000
    });
    this.twFacturaProveedorProductoIngreso = ingreso;
  }),

  concatMap(() =>
    this.obtenerIngresosProductoFactura(this.twFacturaProveedorProducto.nId)
  )
).subscribe({
  next: () => {
    this.resetearFormulario();
    this.verificarYGuardarFactura(productoBodega.nIdProducto);
  },
  error: err => {
    console.error('Error en el proceso de ingreso del producto:', err);
  }
});
    
  }


/*Limpiar el formulario */
  private resetearFormulario(): void {
  this.formGrp.reset();
  this.twFacturaProveedorProductoIngreso = new TwFacturaProveedorProductoIngreso();
}

private verificarYGuardarFactura(idProducto:number): void {
  if (this.totalPendiente === 0) {
    this.twFacturaProveedorProducto.nEstatus = 1;
    this.comprasService.saveProductoFactura(this.twFacturaProveedorProducto).subscribe(prductoFactura => {
      this.twFacturaProveedorProducto = prductoFactura;
      this.messageService.add({
        severity: 'success',
        summary: 'Mensaje',
        detail: 'Ingreso completado',
        life: 3000
      });

     
    });
  }

  if (this.totalProductoPendiente > 0) {

    this.comprasService.surtirVentasPedido(idProducto).subscribe(prod=>{
           this.listaProductoBodega=prod;

             this.ref.close();

         })
   }

}






 


  descontarVentasPedido(){




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
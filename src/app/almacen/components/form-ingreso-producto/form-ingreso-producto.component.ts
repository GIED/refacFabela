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

  ngOnInit(): void {
    const modelContainer: ModelContainer = this.config.data;
    this.twFacturaProveedorProducto = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwFacturaProveedorProducto() : modelContainer.modelData as TwFacturaProveedorProducto;

    if (this.twFacturaProveedorProducto) {
      this.mostrarDistribucionBodegas(this.twFacturaProveedorProducto);
      this.createFormGroup();
      this.loadInitialData();
      this.obtenerIngresosProductoFactura(this.twFacturaProveedorProducto.nId);
    }
  }

  private loadInitialData(): void {
    this.bodegasService.obtenerBodegas().subscribe(bodegas => this.listaBodegas = bodegas);
    this.anaquelService.obtenerAnanquel().subscribe(anaquel => this.listaAnaquel = anaquel);
    this.nivelService.obtenerNivel().subscribe(nivel => this.listaNivel = nivel);
  }

  mostrarDistribucionBodegas(twFacturaProveedorProducto: TwFacturaProveedorProducto): void {
    this.bodegasService.obtenerProductoBodegas(twFacturaProveedorProducto.nIdProducto).subscribe(data => this.listaProductoBodega = data);
  }

  onSubmit(): void {
    if (this.formGrp.valid) {
      const productoBodega = this.buscarProductoBodega(this.formGrp.get('bodega')?.value);
      this.twFacturaProveedorProductoIngreso = {
        ...this.twFacturaProveedorProductoIngreso,
        nCantidad: this.formGrp.get('cantidad')?.value,
        dFechaIngreso: this.fechaService.obtenerFechaActualMexicoCentro(),
        nIdUsuario: this.tokenService.getIdUser(),
        nIdFacturaProveedorProducto: this.twFacturaProveedorProducto.nId,
        nEstatus: 0,
        nIdBodega: productoBodega?.nIdBodega || this.formGrp.get('bodega')?.value,
        nIdAnaquel: productoBodega?.nIdAnaquel || this.formGrp.get('anaquel')?.value,
        nIdNivel: productoBodega?.nIdNivel || this.formGrp.get('nivel')?.value
      };

      console.log('esto es lo que voy a guardar', this.twFacturaProveedorProductoIngreso);
    }
  }

  private createFormGroup(): void {
    this.formGrp = new FormGroup({
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      bodega: new FormControl(null, [Validators.required]),
      anaquel: new FormControl(null, [Validators.required]),
      nivel: new FormControl(null, [Validators.required]),
    });
  }

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

  private buscarProductoBodega(bodegaSeleccionada: number): TwProductoBodega | null {
    return this.listaProductoBodega.find(producto => producto.nIdBodega === bodegaSeleccionada) || null;
  }

  private obtenerIngresosProductoFactura(nId: number): void {
    this.comprasService.getProductoFacturaIngreso(nId).subscribe(ingreso => {
      this.listaIngresoProductoFactura = ingreso;
      this.calcularTotalesIngreso(ingreso);
    });
  }

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
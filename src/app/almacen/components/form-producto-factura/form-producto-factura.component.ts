import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TcMarca } from 'src/app/productos/model/TcMarca';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { VwFacturaProductoBalance } from 'src/app/productos/model/VwFacturaProductoBalance';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { ComprasService } from 'src/app/shared/service/compras.service';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ModelContainerData2 } from 'src/app/shared/utils/model-container-data2';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { TwFacturaProveedorProducto } from '../../../shared/service/TwFacturaProveedorProducto';
import { TokenService } from 'src/app/shared/service/token.service';
import { FechaService } from 'src/app/shared/service/fecha.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-producto-factura',
  templateUrl: './form-producto-factura.component.html',
  styleUrls: ['./form-producto-factura.component.scss']
})
export class FormProductoFacturaComponent implements OnInit {
  modelContainer: ModelContainer;
  formGrp: FormGroup;
  vwFacturaProductoBalance: VwFacturaProductoBalance;
  tcProductoSeleccionado: TcProducto;
  listaMarca: TcMarca[] = [];
  twFacturaProveedorProducto: TwFacturaProveedorProducto;
  twFacturaProveedorProductoEdita: TwFacturaProveedorProducto;

  modo: string;

  constructor(
    private catalogoService: CatalogoService,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    public dialogService: DialogService,
    private comprasService: ComprasService,
    private tokenService: TokenService,
    private fechaService: FechaService,
    private messageService: MessageService
  ) {
    this.formGrp = new FormGroup({});
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.vwFacturaProductoBalance = new VwFacturaProductoBalance();
    this.tcProductoSeleccionado = new TcProducto();
    this.twFacturaProveedorProducto = new TwFacturaProveedorProducto();
    this.twFacturaProveedorProductoEdita = new TwFacturaProveedorProducto();
    this.modo = '';
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.catalogoService.obtenerMarcas().subscribe(data => {
      this.listaMarca = data;
    });
  }

  private initFormGroup(): void {
    const modelContainer: ModelContainerData2 = this.config.data;
    this.modo = modelContainer.modeAction;

    if (this.modo === 'CREATE') {
      this.vwFacturaProductoBalance = ObjectUtils.isEmpty(modelContainer.modelData1) ? new VwFacturaProductoBalance() : modelContainer.modelData1 as VwFacturaProductoBalance;
      this.tcProductoSeleccionado = ObjectUtils.isEmpty(modelContainer.modelData2) ? new TcProducto() : modelContainer.modelData2 as TcProducto;
      

      if (this.vwFacturaProductoBalance && this.tcProductoSeleccionado) {
        this.createFormGroup();
      }
    }

    if (this.modo === 'EDIT') {
      
      this.twFacturaProveedorProductoEdita = ObjectUtils.isEmpty(modelContainer.modelData1) ? new TwFacturaProveedorProducto() : modelContainer.modelData1 as TwFacturaProveedorProducto;
      this.tcProductoSeleccionado = ObjectUtils.isEmpty(modelContainer.modelData2) ? new TcProducto() : modelContainer.modelData2 as TcProducto;
     
      if (this.twFacturaProveedorProductoEdita && this.tcProductoSeleccionado) {
        this.editFormGroup();
      }
    }
  }

  private createFormGroup(): void {
    this.formGrp = new FormGroup({
      noParte: new FormControl({ value: this.tcProductoSeleccionado.sNoParte, disabled: true }, Validators.required),
      marca: new FormControl({ value: this.tcProductoSeleccionado.nIdMarca, disabled: true }, Validators.required),
      cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
      precio: new FormControl(null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      moneda: new FormControl({ value: this.vwFacturaProductoBalance.tcMoneda.sMoneda, disabled: true }, Validators.required),
    });
  }

  private editFormGroup(): void {
    console.log(this.twFacturaProveedorProductoEdita);
 
    this.formGrp = new FormGroup({
      noParte: new FormControl({ value: this.twFacturaProveedorProductoEdita.tcProducto.sNoParte, disabled: true }, Validators.required),
      marca: new FormControl({ value: this.twFacturaProveedorProductoEdita.nIdMarca, disabled: true }, Validators.required),
      cantidad: new FormControl({ value: this.twFacturaProveedorProductoEdita.nCantidad, disabled: false }, [Validators.required, Validators.min(1)]),
      precio: new FormControl({ value: this.twFacturaProveedorProductoEdita.nPrecioUnitario, disabled: false }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      moneda: new FormControl({ value: this.tcProductoSeleccionado.sMoneda, disabled: true }, Validators.required),
    });
  }

  onSubmit(): void {
    if (this.formGrp.valid) {
      if (this.modo === 'CREATE') {
        this.prepareCreateData();
      }

      if (this.modo === 'EDIT') {
        this.prepareEditData();
      }

      this.comprasService.saveProductoFactura(this.twFacturaProveedorProducto).subscribe(
        data => {
          this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Guardado con éxito', life: 3000 });
          this.ref.close();
        },
        error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al guardar', life: 3000 });
          this.ref.close();
        }
      );
    }
  }

  private prepareCreateData(): void {
    this.twFacturaProveedorProducto.nIdFacturaProveedor = this.vwFacturaProductoBalance.nId;
    this.twFacturaProveedorProducto.nCantidad = this.formGrp.get('cantidad')?.value;
    this.twFacturaProveedorProducto.nPrecioUnitario = this.formGrp.get('precio')?.value;
    this.twFacturaProveedorProducto.nIdMarca = this.tcProductoSeleccionado.nIdMarca;
    this.twFacturaProveedorProducto.nEstatus = 1;
    this.twFacturaProveedorProducto.nIdProducto = this.tcProductoSeleccionado.nId;
    this.twFacturaProveedorProducto.nIdUsuario = this.tokenService.getIdUser();
    this.twFacturaProveedorProducto.dFechaRegistro = this.fechaService.obtenerFechaActualMexicoCentro();
  }

  private prepareEditData(): void {    
    this.twFacturaProveedorProductoEdita.nCantidad = this.formGrp.get('cantidad')?.value;
    this.twFacturaProveedorProductoEdita.nPrecioUnitario = this.formGrp.get('precio')?.value;
    this.twFacturaProveedorProducto=this.twFacturaProveedorProductoEdita;
  }

  get noParte() {
    return this.formGrp.get('noParte') as FormControl;
  }
  get marca() {
    return this.formGrp.get('marca') as FormControl;
  }
  get cantidad() {
    return this.formGrp.get('cantidad') as FormControl;
  }
  get precio() {
    return this.formGrp.get('precio') as FormControl;
  }
  get moneda() {
    return this.formGrp.get('moneda') as FormControl;
  }
}
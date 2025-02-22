import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { FacturasProveedorComponent } from 'src/app/administracion/pages/facturas-proveedor/facturas-proveedor.component';
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
  listaMarca: TcMarca[];
  twFacturaProveedorProducto:TwFacturaProveedorProducto;
  constructor(private _catalogoService: CatalogoService, public config: DynamicDialogConfig, public ref: DynamicDialogRef, 
    public dialogService: DialogService, public _comprasService: ComprasService, private tokenService: TokenService, private _fecha:FechaService) {
    this.formGrp = new FormGroup({});
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.vwFacturaProductoBalance = new VwFacturaProductoBalance();
    this.listaMarca = []
    this.tcProductoSeleccionado=new TcProducto();
    this.twFacturaProveedorProducto=new TwFacturaProveedorProducto();
  }

  ngOnInit(): void {

    this._initFormGroup();

    this._catalogoService.obtenerMarcas().subscribe(data => {
      this.listaMarca = data;

    });
  }

  _initFormGroup(): void {
    let modelContainer: ModelContainerData2 = this.config.data;
    this.vwFacturaProductoBalance = ObjectUtils.isEmpty(modelContainer.modelData1) ? new VwFacturaProductoBalance() : modelContainer.modelData1 as VwFacturaProductoBalance;
    this.tcProductoSeleccionado = ObjectUtils.isEmpty(modelContainer.modelData2) ? new TcProducto() : modelContainer.modelData2 as TcProducto;

    this.formGrp = new FormGroup({
      noParte: new FormControl({ value: this.tcProductoSeleccionado.sNoParte, disabled: true }, Validators.required),
      marca: new FormControl({ value: this.tcProductoSeleccionado.nIdMarca, disabled: true }, Validators.required),
      cantidad: new FormControl({ value: '' }, [Validators.required, Validators.min(1)]),
      precio: new FormControl({ value: '' }, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      moneda: new FormControl({ value: this.vwFacturaProductoBalance.tcMoneda.sMoneda, disabled: true }, Validators.required),
    });
  }


  onSubmit(): void {
    if (this.formGrp.valid) {
      const formData = this.formGrp.value;
     this.twFacturaProveedorProducto.nIdFacturaProveedor=this.vwFacturaProductoBalance.nId;
     this.twFacturaProveedorProducto.nCantidad=this.formGrp.get('cantidad')?.value;  
     this.twFacturaProveedorProducto.nPrecioUnitario=this.formGrp.get('precio')?.value;
     this.twFacturaProveedorProducto.nIdMarca=this.tcProductoSeleccionado.nIdMarca;
     this.twFacturaProveedorProducto.nEstatus=1;
     this.twFacturaProveedorProducto.nIdProducto=this.tcProductoSeleccionado.nId;
     this.twFacturaProveedorProducto.nIdUsuario=this.tokenService.getIdUser();     
     this.twFacturaProveedorProducto.dFechaRegistro=this._fecha.obtenerFechaActualMexicoCentro();

     console.log('esto es lo que voy a guardar', this.twFacturaProveedorProducto)

     this._comprasService.saveProductoFactura(this.twFacturaProveedorProducto).subscribe(data=>{{
      
      console.log('esto es lo que guarde', data);
      this.ref.close();

     }})


    }


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
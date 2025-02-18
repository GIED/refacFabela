import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { VwFacturaProductoBalance } from 'src/app/productos/model/VwFacturaProductoBalance';
import { VwMetaProductoCompra } from 'src/app/productos/model/VwMetaProductoCompra';
import { ComprasService } from 'src/app/shared/service/compras.service';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcMarca } from 'src/app/productos/model/TcMarca';
import { disable } from 'colors';

@Component({
  selector: 'app-form-registro-producto-factura',
  templateUrl: './form-registro-producto-factura.component.html',
  styleUrls: ['./form-registro-producto-factura.component.scss']
})
export class FormRegistroProductoFacturaComponent implements OnInit {

   modelContainer: ModelContainer;
   formGrp: FormGroup;
   vwFacturaProductoBalance:VwFacturaProductoBalance;
   listaMarca:TcMarca[]; // Aquí puedes cargar la lista de marcas

  constructor(private comprasService: ComprasService, public ref: DynamicDialogRef,
      public config: DynamicDialogConfig, private _catalogoService:CatalogoService ) { 
      this.formGrp = new FormGroup({});
      this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.vwFacturaProductoBalance=new VwFacturaProductoBalance() ;
    this.listaMarca=[];
      }

  ngOnInit(): void {
    
   
   this._initFormGroup();
     
      this._catalogoService.obtenerMarcas().subscribe(data=>{
        this.listaMarca=data;
      
      });

  }

  _initFormGroup(): void {
      let modelContainer: ModelContainer = this.config.data;
      this.vwFacturaProductoBalance = ObjectUtils.isEmpty(modelContainer.modelData) ? new VwFacturaProductoBalance() : modelContainer.modelData as VwFacturaProductoBalance; 
      this.formGrp = new FormGroup({
        noParte: new FormControl({ value: '', disabled: true }, Validators.required),
        marca: new FormControl({ value: '', disabled: true }, Validators.required),
        cantidad: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.min(1)]),
        precio: new FormControl({ value: '', disabled: true }, [Validators.required , Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
        moneda: new FormControl({ value: '', disabled: true }, Validators.required),
    });
    }

  onProductoSeleccionado(producto: TcProducto) {
      
   if(producto){
    this.cantidad.enable();
    this.precio.enable();



    this.marca.setValue(producto.nIdMarca);
   this.noParte.setValue(producto.sNoParte+'-'+producto.sProducto);
   this.moneda.setValue(producto.sMoneda);


   }
   


    }

    onSubmit(): void {
      if (this.formGrp.valid) {
        const formData = this.formGrp.value;
        console.log('Formulario enviado:', formData);
        // Aquí llamas al servicio para enviar los datos
       
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

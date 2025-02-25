import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';
import { TcBodega } from 'src/app/productos/model/TcBodega';
import { TcNivel } from 'src/app/productos/model/TcNivel';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { ComprasService } from 'src/app/shared/service/compras.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TwFacturaProveedorProducto } from 'src/app/shared/service/TwFacturaProveedorProducto';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { AnaquelService } from '../../../shared/service/anaquel.service';
import { NivelService } from '../../../shared/service/nivel.service';

@Component({
  selector: 'app-form-ingreso-producto',
  templateUrl: './form-ingreso-producto.component.html',
  styleUrls: ['./form-ingreso-producto.component.scss']
})
export class FormIngresoProductoComponent implements OnInit {
  twFacturaProveedorProducto:TwFacturaProveedorProducto=new TwFacturaProveedorProducto();;
  modelContainer: ModelContainer= new ModelContainer(ModeActionOnModel.WATCHING);
    formGrp: FormGroup;
  listaProductoBodega:TwProductoBodega[]=[];
    listaBodegas: TcBodega[]=[];
      listaAnaquel: TcAnaquel[]=[];
      listaNivel: TcNivel[]=[];
  


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
        private nivelService: NivelService
  ) {  
  this.formGrp = new FormGroup({});   

  }

  ngOnInit(): void {

     const modelContainer: ModelContainer = this.config.data;
      this.twFacturaProveedorProducto = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwFacturaProveedorProducto() : modelContainer.modelData as TwFacturaProveedorProducto;
      
    if (this.twFacturaProveedorProducto) {
      this.mostrarDistribucionBodegas(this.twFacturaProveedorProducto);
      this.createFormGroup();
      this.bodegasService.obtenerBodegas().subscribe(bodegas => {
        this.listaBodegas = bodegas;
      });

      this.anaquelService.obtenerAnanquel().subscribe(anaquel => {
        this.listaAnaquel = anaquel;
      });

      this.nivelService.obtenerNivel().subscribe(nivel => {
        this.listaNivel = nivel;
      });

    }
      
       

        
  }

  mostrarDistribucionBodegas (twFacturaProveedorProducto: TwFacturaProveedorProducto){
    this.bodegasService.obtenerProductoBodegas(twFacturaProveedorProducto.nIdProducto).subscribe(data=>{
      this.listaProductoBodega=data;      

    })

  }
  onSubmit(): void {

  }

   private createFormGroup(): void {
      this.formGrp = new FormGroup({
      
        cantidad: new FormControl(null, [Validators.required, Validators.min(1)]),
        bodega: new FormControl(null, [Validators.required]),
        anaquel: new FormControl(null, [Validators.required]),
        nivel: new FormControl(null, [Validators.required]),



       
      });
    }
    
    validaInventarioBodega(){

      let productoBodeda=this.buscarProductoBodega(this.formGrp.get('bodega')?.value);
      console.log(productoBodeda);

      if(productoBodeda && productoBodeda.nCantidad>0 ){
       
         

       console.log('tengo que bloquear el nivel y anaquel');



      }
      else{

        console.log('no bloquear el nivel y anaquel');

      }


      

    }

    private buscarProductoBodega(bodegaSeleccionada: number): TwProductoBodega | null {
        return this.listaProductoBodega.find(producto => producto.nIdBodega === bodegaSeleccionada) || null;
      }





    get cantidad() {
      return this.formGrp.get('cantidad') as FormControl;
    }
    get anaquel() {
      return this.formGrp.get('anaquel') as FormControl;
    }
    get nivel() {
      return this.formGrp.get('nivel') as FormControl;
    }
    get bodega() {
      return this.formGrp.get('bodega') as FormControl;
    }

   

  

}

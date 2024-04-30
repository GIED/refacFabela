import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UsuarioService } from 'src/app/administracion/service/usuario.service';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TraspasoService } from 'src/app/shared/service/traspaso.service';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { AnaquelService } from '../../../shared/service/anaquel.service';
import { NivelService } from '../../../shared/service/nivel.service';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';
import { TcNivel } from 'src/app/productos/model/TcNivel';
import { TwAjusteInventario } from '../../../productos/model/TwAjusteInventario';

@Component({
  selector: 'app-ajuste-inventario',
  templateUrl: './ajuste-inventario.component.html',
  styleUrls: ['./ajuste-inventario.component.scss']
})
export class AjusteInventarioComponent implements OnInit {

  modelContainer: ModelContainer;
  formGrp: FormGroup;
  productoBodega:TwProductoBodega;
  listaAnaquel: TcAnaquel[];
  listaNivel: TcNivel[];
  twAjusteInventario: TwAjusteInventario;
  IdUsuario:number;


  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,    
   private traspasoService:TraspasoService,
   private anaquelService:AnaquelService,
   private nivelService:NivelService,
   private tokenService: TokenService,

  ) { 

    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
   this.twAjusteInventario=new TwAjusteInventario;

  }

  ngOnInit(): void {

    this._initFormGroup();
    this.IdUsuario=this.tokenService.getIdUser();

  
  }

  _initFormGroup(): void {
    let modelContainer: ModelContainer = this.config.data;
    this.productoBodega = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwProductoBodega() : modelContainer.modelData as TwProductoBodega;
    //console.log(this.productoBodega);
    this.formGrp = new FormGroup({
      cantidadCtrl: new FormControl('', [Validators.required]),
      motivoCtrl: new FormControl('', [Validators.required,  Validators.maxLength(200)]),
      
    });
  }

  castFormGrup(){
    let model = this.productoBodega;
    model.nCantidad=this.cantidadCtrl.value;

    return model;

  }


  onGuardarClicked(){
  


    



    //console.log(this.twAjusteInventario); 
    //console.log(this.cantidadCtrl.value)
 
    this.twAjusteInventario.nIdProducto=this.productoBodega.nIdProducto;
    this.twAjusteInventario.nIdBodega=this.productoBodega.nIdBodega;
    this.twAjusteInventario.nIdNivel=this.productoBodega.nIdNivel;
    this.twAjusteInventario.nIdAnaquel=this.productoBodega.nIdAnaquel;
    this.twAjusteInventario.nCantidadAnterior=this.productoBodega.nCantidad;
    this.twAjusteInventario.nCantidadActual=this.cantidadCtrl.value;
    this.twAjusteInventario.nTotalAjustado=this.cantidadCtrl.value-this.productoBodega.nCantidad;
    this.twAjusteInventario.nIdUsuario=this.tokenService.getIdUser();
    this.twAjusteInventario.sMotivo=this.motivoCtrl.value;

    //console.log("Este el objeto que mandare a registrase",this.twAjusteInventario);
    this.traspasoService.guardarAjusteInventario(this.twAjusteInventario).subscribe(data=>{

      this.traspasoService.guardarMovimientoInterno2(this.castFormGrup()).subscribe(resp => {
        this.ref.close(resp.twProductobodega);
      });
    })




  }

  onCancelarClicked(){

    this.ref.close(null);

  }

  get cantidadCtrl() {
    return this.formGrp.get('cantidadCtrl') as FormControl;
  }
  get motivoCtrl() {
    return this.formGrp.get('motivoCtrl') as FormControl;
  }


}

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ModelContainer } from '../../../shared/utils/model-container';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ModeActionOnModel } from '../../../shared/utils/model-action-on-model';
import { TwProductoBodega } from '../../model/TwProductoBodega';
import { ObjectUtils } from '../../../shared/utils/object-ultis';
import { TcAnaquel } from 'src/app/productos/model/TcAnaquel';
import { TcNivel } from '../../model/TcNivel';
import { AnaquelService } from '../../../shared/service/anaquel.service';
import { NivelService } from '../../../shared/service/nivel.service';
import { TraspasoService } from '../../../shared/service/traspaso.service';

@Component({
  selector: 'app-modal-productos-bodega',
  templateUrl: './modal-productos-bodega.component.html',
  styleUrls: ['./modal-productos-bodega.component.scss']
})
export class ModalProductosBodegaComponent implements OnInit {

  modelContainer: ModelContainer;
  formGrp: FormGroup;
  productoBodega:TwProductoBodega;

  listaAnaquel: TcAnaquel[];
  listaNivel: TcNivel[];


  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private anaquelService: AnaquelService,
    private nivelService: NivelService, private traspasoService:TraspasoService) {
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
   }

  ngOnInit(): void {
  this._initFormGroup();
  this.anaquelService.obtenerAnanquel().subscribe(anaquel => {
    this.listaAnaquel = anaquel;
});

this.nivelService.obtenerNivel().subscribe(nivel => {
    this.listaNivel = nivel;
});
  }

  _initFormGroup(): void {
    let modelContainer: ModelContainer = this.config.data;
    this.productoBodega = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwProductoBodega() : modelContainer.modelData as TwProductoBodega;
    //console.log(this.productoBodega);
    this.formGrp = new FormGroup({
      anaquelCtrl: new FormControl(this.productoBodega.nIdAnaquel, [Validators.required]),
      nivelCtrl: new FormControl(this.productoBodega.nIdNivel,[Validators.required])
    });
  }

  castFormGrup(){
    let model = this.productoBodega;
    model.nIdAnaquel= this.anaquelCtrl.value;
    model.nIdNivel= this.nivelCtrl.value;

    return model;

  }


  onGuardarClicked(){

    this.traspasoService.guardarMovimientoInterno(this.castFormGrup()).subscribe(resp => {
      this.ref.close(resp.twProductobodega);
    })


  }

  onCancelarClicked(){

    this.ref.close(null);

  }

  get anaquelCtrl() {
    return this.formGrp.get('anaquelCtrl') as FormControl;
  }

  get nivelCtrl() {
    return this.formGrp.get('nivelCtrl') as FormControl;
  }

  
}

 



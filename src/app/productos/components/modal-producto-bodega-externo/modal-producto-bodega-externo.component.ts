import { Component, OnInit } from '@angular/core';
import { ModelContainer } from '../../../shared/utils/model-container';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TwProductoBodega } from '../../model/TwProductoBodega';
import { TcAnaquel } from '../../model/TcAnaquel';
import { TcNivel } from '../../model/TcNivel';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AnaquelService } from '../../../shared/service/anaquel.service';
import { NivelService } from '../../../shared/service/nivel.service';
import { TraspasoService } from '../../../shared/service/traspaso.service';
import { ModeActionOnModel } from '../../../shared/utils/model-action-on-model';
import { ObjectUtils } from '../../../shared/utils/object-ultis';
import { BodegasService } from '../../../shared/service/bodegas.service';
import { TcBodega } from '../../model/TcBodega';
import { TwProductoBodegaDto } from '../../model/TwProductoBodegaDto';

interface Bodegai{
  nId?: number;
  inactive?: boolean;
  sBodega?: string;
}

@Component({
  selector: 'app-modal-producto-bodega-externo',
  templateUrl: './modal-producto-bodega-externo.component.html',
  styleUrls: ['./modal-producto-bodega-externo.component.scss']
})
export class ModalProductoBodegaExternoComponent implements OnInit {

  modelContainer: ModelContainer;
  formGrp: FormGroup;
  productoBodega:TwProductoBodega;

  listaBodega:TcBodega[];
  listaAux:Bodegai[]=[];
  bodegaI:Bodegai;
  


  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig,private bodegasService: BodegasService, private anaquelService: AnaquelService,
    private nivelService: NivelService, private traspasoService:TraspasoService) {
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
   }

  ngOnInit(): void {
  this._initFormGroup();

  

  this.bodegasService.obtenerBodegas().subscribe(bodegas => {

    for (let index = 0; index < bodegas.length; index++) {
      const valor = bodegas[index];
      this.bodegaI={nId:valor.nId, sBodega:valor.sBodega, inactive: this.productoBodega.nIdBodega == valor.nId ? true : false};
      this.listaAux.push(this.bodegaI);
      
    }

    


});
  }

  _initFormGroup(): void {
    let modelContainer: ModelContainer = this.config.data;
    this.productoBodega = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwProductoBodega() : modelContainer.modelData as TwProductoBodega;
    this.formGrp = new FormGroup({
      bodegaCtrl: new FormControl('', [Validators.required]),
      cantidadCtrl: new FormControl('',[Validators.required])
    });
  }

  castFormGrp(){
    let model = new TwProductoBodegaDto();
    model.nIdBodegaActual=this.productoBodega.nIdBodega;
    model.nCantidadActual=this.productoBodega.nCantidad;
    model.nIdBodegaDestino=this.bodegaCtrl.value;
    model.nCantidadDestino=this.cantidadCtrl.value;

    return model;

  }


  onGuardarClicked(){
      //console.log(this.castFormGrp());
      this.ref.close(this.castFormGrp());
  }

  onCancelarClicked(){

    this.ref.close(null);

  }

  get bodegaCtrl() {
    return this.formGrp.get('bodegaCtrl') as FormControl;
  }
  
  get cantidadCtrl() {
    return this.formGrp.get('cantidadCtrl') as FormControl;
  }

}

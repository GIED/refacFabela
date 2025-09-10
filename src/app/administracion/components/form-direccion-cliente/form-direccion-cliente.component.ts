import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ClienteDireccionEnvio } from '../../model/ClienteDireccionEnvio';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { Model } from 'src/app/shared/utils/model';
import { ClienteDireccionService } from 'src/app/shared/service/cliente-direccion.service';

@Component({
  selector: 'app-form-direccion-cliente',
  templateUrl: './form-direccion-cliente.component.html',
  styleUrls: ['./form-direccion-cliente.component.scss']
})
export class FormDireccionClienteComponent implements OnInit {

  formGrp: FormGroup;
  modelContainer: ModelContainer;
  clienteDireccionEnvio: ClienteDireccionEnvio;
  saving = false;

  constructor(public ref: DynamicDialogRef, public config: DynamicDialogConfig, private clienteDireccionService: ClienteDireccionService) {
    this.formGrp = new FormGroup({});
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.clienteDireccionEnvio = new ClienteDireccionEnvio();
  }

  ngOnInit(): void {
    this._initFormGroup();
  }

  _initFormGroup(): void {

    this.modelContainer = this.config.data;
    this.clienteDireccionEnvio = ObjectUtils.isEmpty(this.modelContainer.modelData) ? new ClienteDireccionEnvio() : this.modelContainer.modelData as ClienteDireccionEnvio;
    console.log('esto es lo que trae el modelo', this.clienteDireccionEnvio); 
    this.formGrp = new FormGroup({
      sReceptorCtrl: new FormControl(this.clienteDireccionEnvio?.sReceptor, [Validators.required]),
      sTelCtrl: new FormControl(this.clienteDireccionEnvio?.sTel, [Validators.required, Validators.pattern(/^\d{10}$/)]),
      sCorreoCtrl: new FormControl(this.clienteDireccionEnvio?.sCorreo, [Validators.required, Validators.email]),
      sCalleCtrl: new FormControl(this.clienteDireccionEnvio?.sCalle, [Validators.required]),
      sNumExtCtrl: new FormControl(this.clienteDireccionEnvio?.sNumExt, [Validators.required]),
      sNumIntCtrl: new FormControl(this.clienteDireccionEnvio?.sNumInt,),
      sColoniaCtrl: new FormControl(this.clienteDireccionEnvio?.sColonia, Validators.required),
      nCpCtrl: new FormControl(this.clienteDireccionEnvio?.nCp, [Validators.required,Validators.pattern(/^\d{5}$/)]),
      sMunicipioCtrl: new FormControl(this.clienteDireccionEnvio?.sMunicipio, [Validators.required]),
      sEstadoCtrl: new FormControl(this.clienteDireccionEnvio?.sEstado, [Validators.required]),
      sReferenciasCtrl: new FormControl(this.clienteDireccionEnvio?.sReferencias, [Validators.required]),
      bPredeterminadaCtrl: new FormControl(this.clienteDireccionEnvio?.bPredeterminada, [])

    });
  }

  _castFormGrp(): Model {
    this.clienteDireccionEnvio.nId= this.clienteDireccionEnvio?.nId;
    this.clienteDireccionEnvio.sReceptor = this.sReceptorCtrl.value;
    this.clienteDireccionEnvio.sTel = this.sTelCtrl.value;
    this.clienteDireccionEnvio.sCorreo = this.sCorreoCtrl.value;
    this.clienteDireccionEnvio.sCalle = this.sCalleCtrl.value;
    this.clienteDireccionEnvio.sNumExt = this.sNumExtCtrl.value;
    this.clienteDireccionEnvio.sNumInt = this.sNumIntCtrl.value;
    this.clienteDireccionEnvio.sColonia = this.sColoniaCtrl.value;
    this.clienteDireccionEnvio.nCp = this.nCpCtrl.value;
    this.clienteDireccionEnvio.sMunicipio = this.sMunicipioCtrl.value;
    this.clienteDireccionEnvio.sEstado = this.sEstadoCtrl.value;
    this.clienteDireccionEnvio.sReferencias = this.sReferenciasCtrl.value;
    this.clienteDireccionEnvio.bPredeterminada = this.bPredeterminadaCtrl.value;

    return this.clienteDireccionEnvio;
  }

  guardar() {
  if (this.formGrp.invalid) {
    this.formGrp.markAllAsTouched();
    return;
  }
  this.saving = true;
  console.log('esto es lo que se va a guardar ', this._castFormGrp() as ClienteDireccionEnvio);

  // this.clienteDireccionService.guardar(this.clienteDireccionEnvio.nId, this._castFormGrp() as ClienteDireccionEnvio).subscribe({
  //   next: (data) => {
  //     this.ref.close(data);
  //   },
  //   error: (err) => {
  //     console.error('Error al guardar la dirección:', err);
  //     this.saving = false;
  //   }
  // });

  
  
  // ... tu lógica de guardado
  // al finalizar:
  // this.saving = false;
}

  hideDialog() {
    this.ref.close(null);
  }



    get sReceptorCtrl() {
    return this.formGrp.get('sReceptorCtrl') as FormControl;
  }
    get sTelCtrl() {
    return this.formGrp.get('sTelCtrl') as FormControl;
  }
    get sCorreoCtrl() {
    return this.formGrp.get('sCorreoCtrl') as FormControl;
  }
    get sCalleCtrl() {
    return this.formGrp.get('sCalleCtrl') as FormControl;
  }
    get sNumExtCtrl() {
    return this.formGrp.get('sNumExtCtrl') as FormControl;
  }
    get sNumIntCtrl() {
    return this.formGrp.get('sNumIntCtrl') as FormControl;
  }
    get sColoniaCtrl() {
    return this.formGrp.get('sColoniaCtrl') as FormControl;
  }
    get nCpCtrl() {
    return this.formGrp.get('nCpCtrl') as FormControl;
  }
    get sMunicipioCtrl() {
    return this.formGrp.get('sMunicipioCtrl') as FormControl;
  }
    get sEstadoCtrl() {
    return this.formGrp.get('sEstadoCtrl') as FormControl;
  }
    get sReferenciasCtrl() {
    return this.formGrp.get('sReferenciasCtrl') as FormControl;
  }
    get bPredeterminadaCtrl() {
    return this.formGrp.get('bPredeterminadaCtrl') as FormControl;
  }
  

}

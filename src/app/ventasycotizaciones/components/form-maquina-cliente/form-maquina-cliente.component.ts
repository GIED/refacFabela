import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { VentasService } from '../../../shared/service/ventas.service';
import { TwMaquinaCliente } from '../../../productos/model/TwMaquinaCliente';

@Component({
  selector: 'app-form-maquina-cliente',
  templateUrl: './form-maquina-cliente.component.html',
  styleUrls: ['./form-maquina-cliente.component.scss']
})
export class FormMaquinaClienteComponent implements OnInit {

  @Input() twMaquinaCliente:TwMaquinaCliente;
  formMaquinas:FormGroup;
  maquinaCliente:TwMaquinaCliente;
  mostrarFormularioMaquinasClienteEdita=false;
  mostrarFormularioMaquinasCliente=false;
  @Output() cierraformulario: EventEmitter<boolean> = new EventEmitter();



  constructor(private messageService: MessageService, private ventasService: VentasService, private fb: FormBuilder) {
    this._initFormGroupMaquinas();
    this.maquinaCliente=new TwMaquinaCliente;
    
   }

  ngOnInit() {

    if(this.twMaquinaCliente.nId){
      this.fMaquina.marcaCtrl.setValue(this.twMaquinaCliente.sMarca);
      this.fMaquina.serieCtrl.setValue(this.twMaquinaCliente.sSerie);
      this.fMaquina.observacionesCtrl.setValue(this.twMaquinaCliente.sObservaciones);

    }


  }
  _initFormGroupMaquinas(){ 
    this.formMaquinas=this.fb.group({
      serieCtrl: new FormControl("",[Validators.required]),
      marcaCtrl: new FormControl("",[Validators.required]),
      observacionesCtrl: new FormControl("",[Validators.required])

    });   
  }
  guardarMaquina(){

    if (this.formMaquinas.invalid) {
  
      return Object.values(this.formMaquinas.controls).forEach(control => {

        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable
          
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }

      });
    }else{
      this.maquinaCliente.nId=this.twMaquinaCliente.nId;
      this.maquinaCliente.nIdCliente=this.twMaquinaCliente.nIdCliente;
      this.maquinaCliente.sMarca=this.fMaquina.marcaCtrl.value;
      this.maquinaCliente.sSerie=this.fMaquina.serieCtrl.value;
      this.maquinaCliente.sObservaciones=this.fMaquina.observacionesCtrl.value;

      // console.log(this.maquinaCliente);

      this.ventasService.guardarMaquina(this.maquinaCliente).subscribe(data=>{
        this.limpiaFormulario();
        this.cierraformulario.emit(false);      

        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'La maquina se guardo con éxito', life: 5000});

      });
     
    
      
     
    }

  }

  limpiaFormulario(){
    this.fMaquina.marcaCtrl.setValue("");
    this.fMaquina.serieCtrl.setValue("");
    this.fMaquina.observacionesCtrl.setValue("");

  }



  get validaSerieCtrl(){   
    return this.formMaquinas.get('serieCtrl').invalid && this.formMaquinas.get('serieCtrl').touched;
  }
  get validaMarcaCtrl(){
    return this.formMaquinas.get('marcaCtrl').invalid && this.formMaquinas.get('marcaCtrl').touched;
   
  }
  get validaObservacionesCtrl(){
    return this.formMaquinas.get('observacionesCtrl').invalid && this.formMaquinas.get('observacionesCtrl').touched;

  }

  get fMaquina(){
    return this.formMaquinas.controls;
}

}

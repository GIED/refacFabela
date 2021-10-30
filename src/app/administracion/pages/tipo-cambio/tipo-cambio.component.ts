import { MessageService, SelectItem } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { CountryService } from 'src/app/demo/service/countryservice';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TipoCambioService } from '../../service/tipo-cambio.service';
import { TipoCambio } from '../../interfaces/tipoCambio';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-tipo-cambio',
  templateUrl: './tipo-cambio.component.html',
  styles: [`:host ::ng-deep .p-multiselect {
		min-width: 15rem;
	}

	:host ::ng-deep .multiselect-custom-virtual-scroll .p-multiselect {
		min-width: 20rem;
	}

	:host ::ng-deep .multiselect-custom .p-multiselect-label {
		padding-top: .25rem;
		padding-bottom: .25rem;

	}


	:host ::ng-deep .multiselect-custom .country-item.country-item-value {
		padding: .25rem .5rem;
		border-radius: 3px;
		display: inline-flex;
		margin-right: .5rem;
		background-color: var(--primary-color);
		color: var(--primary-color-text);
	}

	:host ::ng-deep .multiselect-custom .country-item.country-item-value img.flag {
		width: 17px;
	}

	:host ::ng-deep .multiselect-custom .country-item {
		display: flex;
		align-items: center;
	}

	:host ::ng-deep .multiselect-custom .country-item img.flag {
		width: 18px;
		margin-right: .5rem;
	}

	:host ::ng-deep .multiselect-custom .country-placeholder {
		padding: 0.25rem;
	}

	:host ::ng-deep .p-colorpicker {
		width: 2.5em
	}
    `]
})
export class TipoCambioComponent implements OnInit {

	formulario:FormGroup;

	tipoCambio: TipoCambio;



  
  constructor(private fb: FormBuilder, private tipoCambioService: TipoCambioService, private messageService: MessageService,
	private spinner: NgxSpinnerService ) {
     this.crearFormulario();
  }

  get validaValor() {
	return this.formulario.get('nValor').invalid && this.formulario.get('nValor').touched;
  }

  crearFormulario() {
  
	this.formulario = this.fb.group({
		nId: ['',[]],
		nValor: ['',[Validators.required]],
		sClave: ['',[]],
		sDescripcion: ['',[]],
	});

  }

  ngOnInit() {
      this.obtenerTipoCambio();
  }

  obtenerTipoCambio(){
	  console.log("Entre a obtener el tipo de cambio")
	  this.spinner.show();
	  this.tipoCambio=this.formulario.value;
	  this.tipoCambio.sClave='ValorCambio';
	  this.tipoCambioService.obtenerTipoCambio(this.tipoCambio).subscribe(tipoCambio =>{
		 
			  this.fTipoCambio.nId.setValue(tipoCambio.nId);
			  this.fTipoCambio.nValor.setValue(tipoCambio.nValor);
			  console.log("el valor del tipo de cambio es:"+this.tipoCambio.nValor);
			  this.fTipoCambio.sClave.setValue(tipoCambio.sClave);
			  this.fTipoCambio.sDescripcion.setValue(tipoCambio.sDescripcion);
	
		this.spinner.hide();
	})
}

guardarTipoCambio(){
	if (this.formulario.invalid) {
  
		return Object.values(this.formulario.controls).forEach(control => {
  
		  if (control instanceof FormGroup) {
			// tslint:disable-next-line: no-shadowed-variable
			
			Object.values(control.controls).forEach(control => control.markAsTouched());
		  } else {
			control.markAsTouched();
		  }
  
		});
	}else{
		this.spinner.show()
		this.tipoCambio= this.formulario.value;
		this.tipoCambioService.guardarTipoCambio(this.tipoCambio).subscribe(tipoCambio => {

			this.fTipoCambio.nId.setValue(tipoCambio.nId);
			  this.fTipoCambio.nValor.setValue(tipoCambio.nValor);
			  this.fTipoCambio.sClave.setValue(tipoCambio.sClave);
			  this.fTipoCambio.sDescripcion.setValue(tipoCambio.sDescripcion);
			  
			  this.spinner.hide();
			  this.messageService.add({severity: 'success', summary: 'Successful', detail: 'tipo cambio actualizado', life: 10000});
		})
	}
}



  get fTipoCambio(){
	return this.formulario.controls;
}



  

}

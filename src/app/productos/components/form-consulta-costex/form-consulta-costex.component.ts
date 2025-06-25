import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartResponse } from '../../model/PartResponse ';
import { PartService } from 'src/app/shared/service/part.service';
import { LocationPart } from '../../model/PartLocation ';

@Component({
  selector: 'app-form-consulta-costex',
  templateUrl: './form-consulta-costex.component.html'
})
export class FormConsultaCostexComponent {
  form: FormGroup;
  resultado?: PartResponse;
  error?: string;
  locationList: LocationPart[] = [];

  constructor(private fb: FormBuilder, private partService: PartService) {
    this.form = this.fb.group({
      numeroParte: ['', Validators.required],
      cantidad: ['1', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  consultar() {
    if (this.form.valid) {
      const { numeroParte, cantidad } = this.form.value;
      this.partService.obtenerProductoCostex(numeroParte, cantidad).subscribe({
        next: (resp) => {
          this.resultado = resp;
          this.error = undefined;
            this.locationList = Object.values(resp.Locations || {});
        },
        error: (err) => {
          this.resultado = undefined;
          this.error = 'Error al consultar: ' + err.message;
        }
      });
    }
  }
}
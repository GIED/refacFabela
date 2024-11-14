import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fecha-rango',
  templateUrl: './fecha-rango.component.html',
  styleUrls: ['./fecha-rango.component.scss']
})
export class FechaRangoComponent implements OnInit {
  formulario: FormGroup;
  @Output() fechasSeleccionadas = new EventEmitter<{ fechaInicio: string; fechaTermino: string }>();



  constructor(private fb: FormBuilder) {
    this.formulario = this.fb.group({
      fechaInicio: [this.getToday(), Validators.required],
      fechaTermino: [this.getToday(), Validators.required]
    });
  }

  ngOnInit(): void {
     
     

  }

  getToday(): string {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Retorna la fecha en formato 'yyyy-MM-dd'
  }

  onSubmit(): void {
    if (this.formulario.valid) {
      console.log('Formulario válido:', this.formulario.value);
      this.fechasSeleccionadas.emit(this.formulario.value); // Emite los valores al padre


    } else {
      console.log('Formulario inválido');
    }
  }
}
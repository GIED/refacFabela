import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TwCotizacion } from '../../../productos/model/TcCotizacion';

@Component({
  selector: 'app-form-carga-comprobante',
  templateUrl: './form-carga-comprobante.component.html',
  styles: [
  ]
})
export class FormCargaComprobanteComponent implements OnInit {

  @Input() cotizacion:TwCotizacion;
  @Output() comprobanteCargado:EventEmitter<File> = new EventEmitter();

  private comprobanteSeleccionado:File;

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  subirComprobante(event){
    this.comprobanteSeleccionado = event.target.files[0];
    console.log(this.comprobanteSeleccionado);
  }

  enviarFoto(){
    this.comprobanteCargado.emit(this.comprobanteSeleccionado);
  }

  

 
}

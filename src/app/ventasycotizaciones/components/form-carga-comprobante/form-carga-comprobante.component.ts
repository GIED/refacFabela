import { Component, Input, OnInit } from '@angular/core';
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

  uploadedFiles: any[] = [];

  constructor(private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onUpload(event) {
    for(let file of event.files) {
        this.uploadedFiles.push(file);
    }

    console.log(this.uploadedFiles);

    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
}


}

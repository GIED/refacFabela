import { Component, OnInit } from '@angular/core';
import { VentasInternetService } from '../../../shared/service/ventas-internet.service';
import { TwPagoComprobanteInternet } from '../../../ventasycotizaciones/model/TwPagoComprobanteInternet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {DialogService} from 'primeng/dynamicdialog';
import { MuestraComprobantePagoComponent } from '../../components/muestra-comprobante-pago/muestra-comprobante-pago.component';
import { ModelContainer } from '../../../shared/utils/model-container';
import { ModeActionOnModel } from '../../../shared/utils/model-action-on-model';

@Component({
  selector: 'app-valida-comprobante',
  templateUrl: './valida-comprobante.component.html',
  styleUrls: ['./valida-comprobante.component.scss']
  
})
export class ValidaComprobanteComponent implements OnInit {

  formGrp: FormGroup;


  listaComprobantesInternet:TwPagoComprobanteInternet[];

  listaRespuestas:any[];
  mostrar:boolean = false;

  constructor(private ventasInternetService:VentasInternetService, public dialogService: DialogService) { 
    
  }

  ngOnInit(): void {
    this.ventasInternetService.consultaPagoComprobante(1).subscribe(respuesta =>{
      this.listaComprobantesInternet=respuesta
    });
    
  }

  show(pagoComprobante:TwPagoComprobanteInternet) {
     const ref = this.dialogService.open(MuestraComprobantePagoComponent, {
        data: new ModelContainer(ModeActionOnModel.CREATING, pagoComprobante),
        header: 'Validar Comprobante de Pago',
        width: '70%'
    });
}


  actualizaEstatus(){
    console.log(this.fValidaPago.validaCtrl.value)
    if(this.fValidaPago.validaCtrl.value === '2'){
      this.mostrar=false;  
    }else{
      this.mostrar=true;
    }
    

  }
  get fValidaPago() {
    return this.formGrp.controls
  }

}

import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModelContainer } from '../../../shared/utils/model-container';
import { ModeActionOnModel } from '../../../shared/utils/model-action-on-model';
import { TwPagoComprobanteInternet } from '../../../ventasycotizaciones/model/TwPagoComprobanteInternet';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Model } from 'src/app/shared/utils/model';
import { VentasInternetService } from '../../../shared/service/ventas-internet.service';
import { MessageService } from 'primeng/api';
import { DatosVenta } from '../../../ventasycotizaciones/interfaces/DatosVenta';
import { TokenService } from '../../../shared/service/token.service';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-muestra-comprobante-pago',
  templateUrl: './muestra-comprobante-pago.component.html',
  styleUrls: ['./muestra-comprobante-pago.component.scss']
})
export class MuestraComprobantePagoComponent implements OnInit {

  modelContainer: ModelContainer;
  formGrp: FormGroup;
  twPagoComprobanteInternet:TwPagoComprobanteInternet;
  mostrar:boolean;
  respuestas: any[] = [{name: 'Aprobar', key: '2'}, {name: 'Rechazado', key: '0'}];
  datosRegistraVenta:DatosVenta;


  constructor(public ref: DynamicDialogRef, 
    public config: DynamicDialogConfig, 
    private ventasInternetService:VentasInternetService,
    private messageService: MessageService,
    private tokenService:TokenService,
    private ventaService:VentasService) {
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.twPagoComprobanteInternet= new TwPagoComprobanteInternet();
    this.datosRegistraVenta= new DatosVenta();
    this.mostrar=false;
   }

  ngOnInit(): void {
    this._initFormGroup();
    this.validaCtrl.value == 0?this.mostrar=true:this.mostrar=false; 
  }

  _initFormGroup(): void {
    let modelContainer: ModelContainer = this.config.data;
    this.twPagoComprobanteInternet = ObjectUtils.isEmpty(modelContainer.modelData) ? new TwPagoComprobanteInternet() : modelContainer.modelData as TwPagoComprobanteInternet;
    //console.log(this.twPagoComprobanteInternet);
    this.formGrp = new FormGroup({
      validaCtrl: new FormControl(this.twPagoComprobanteInternet.nStatus, [Validators.required]),
      observaCtrl: new FormControl(this.twPagoComprobanteInternet.sObservaciones,[Validators.required])
    });
  }

  obtenerValor(){
    if(this.validaCtrl.value==0){
     this.mostrar=true; 
     this.observaCtrl.setValue("");
    }else{
      this.mostrar=false;
      this.observaCtrl.setValue("sin observaciones");
    }
  }



  _castFormGrp(): Model {
    let model = this.twPagoComprobanteInternet;
    model.nStatus= this.validaCtrl.value;
    model.sObservaciones=this.observaCtrl.value;

    return model;
    
  }

  onGuardarClicked(): void {
    this.ventasInternetService.actualizaEstatusComprobante(this._castFormGrp() as TwPagoComprobanteInternet).subscribe(resp =>{
      
      

      this.datosRegistraVenta.idCliente=resp.twPagoComprobanteInternet.nIdCliente;
      this.datosRegistraVenta.idUsuario=this.tokenService.getIdUser();
      this.datosRegistraVenta.sFolioVenta=this.createFolio();
      this.datosRegistraVenta.idTipoVenta=2;
      this.datosRegistraVenta.tipoPago=0;
      this.datosRegistraVenta.fechaIniCredito=null;
      this.datosRegistraVenta.fechaFinCredito=null;
      this.datosRegistraVenta.listaValidada=resp.listacotizacion;
      this.datosRegistraVenta.twCotizacion=resp.twPagoComprobanteInternet.twCotizacionesDetalle;

      this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(venta =>{
        this.ref.close(venta);
        this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Estatus del comprobante, Actualizado Correctamente', life: 3000 });
        });
      
    });
    
  }

  onRechazarClicked(): void {
    this.ventasInternetService.actualizaEstatusComprobante(this._castFormGrp() as TwPagoComprobanteInternet).subscribe(resp =>{
      this.ref.close(resp);
      this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: resp.mensaje, life: 3000 });
    });
    
  }

  onCancelarClicked(): void {
    this.ref.close(null);
  }

  createFolio(): string {
    let folio = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for ( let i = 0; i < 5; i++ ) {
      folio += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return folio;
  } 

  get validaCtrl() {
    return this.formGrp.get('validaCtrl') as FormControl;
  }

  get observaCtrl() {
    return this.formGrp.get('observaCtrl') as FormControl;
  }

}

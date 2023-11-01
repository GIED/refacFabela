import { VentaProductoDto } from './../../../ventasycotizaciones/model/dto/VentaProductoDto';
import { CatalogoService } from './../../../shared/service/catalogo.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TcFormaPago } from 'src/app/productos/model/TcFormaPago';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { forkJoin } from 'rxjs';
import { TrVentaCobro } from '../../../productos/model/TrVentaCobro';
import { TwVenta } from '../../../productos/model/TwVenta';
import { TwCaja } from '../../../productos/model/TwCaja';
import { VwSaldoVentaFavorDisponible } from 'src/app/productos/model/VwSaldoVentaFavorDisponible';

@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.component.html',
  styleUrls: ['./cobrar.component.scss']
})
export class CobrarComponent implements OnInit {

  titulo: string;



  /*objetos definitivos  */
  listaVentasDetalleCliente: TvVentasDetalle[];
  mostrarProductos: boolean;
  listaProductosVenta: VentaProductoDto;
  abrirformulario: boolean;
  VentaDescuentoDto: TvVentasDetalle;
  formulario: FormGroup;
  cols: any[];
  listaFormaPago: TcFormaPago[];
  noVenta: number;
  totalVenta: number;
  mostrarBalance: boolean;
  listaCobrosParciales: TrVentaCobro[];
  total: number;
  aCuenta:number;
  restan:number;
  displayListaVentas:boolean;
  displayListaAbonoVenta:boolean;
  cajaActiva:TwCaja;
  saldoFavor:number;
  saldoTotalFavor:VwSaldoVentaFavorDisponible;
  saldoDisponible:number;
  ventaSaldoFavor:TvVentasDetalle;
  state:boolean;

  constructor(private messageService: MessageService, private ventasService: VentasService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private catalogo: CatalogoService) {

    this.listaCobrosParciales = [];
    this.displayListaVentas=false;
    this.displayListaAbonoVenta=false;

  }

  ngOnInit() {



    this.crearFormulario();
    this.consultaVentas();
    this.cajaActual();


  }

  consultarVentaSaldo(){
    this.saldoTotalFavor=null;
   //console.log('voy a consultar si hay un saldo a favor:', this.saldoFavor);

   if(this.saldoFavor!=null || this.saldoFavor!=undefined){
   this.ventasService.obtenerSaldoVentaFavor(this.saldoFavor).subscribe(data=>{
      this.saldoTotalFavor=data;

      if(this.saldoTotalFavor!=null || this.saldoTotalFavor!=undefined){
        this.saldoDisponible=this.saldoTotalFavor.nSaldoDisponible;

        if(this.ventaSaldoFavor.nSaldoTotal<=this.formulario.controls.monto.value){
                if(this.saldoDisponible<=this.ventaSaldoFavor.nSaldoTotal){
                this.fProducto.monto.setValue((this.ventaSaldoFavor.nSaldoTotal-this.saldoDisponible).toFixed(3));
                this.restan= this.fProducto.monto.value;
                this.VentaDescuentoDto.nSaldoFavor=this.saldoDisponible;
                this.VentaDescuentoDto.nIdVentaUtilizado=this.saldoFavor;          
                this.formulario.controls.monto.disable();
              }
              else{
                this.fProducto.monto.setValue((0).toFixed(3));
                this.restan=0;
                this.VentaDescuentoDto.nSaldoFavor=this.ventaSaldoFavor.nSaldoTotal;
                this.VentaDescuentoDto.nIdVentaUtilizado=this.saldoFavor; 
                this.formulario.controls.monto.disable();  

              }
        }
        else{

          this.fProducto.monto.setValue((0).toFixed(3));
          this.formulario.controls.monto.disable();
          this.VentaDescuentoDto.nSaldoFavor=0;
          this.VentaDescuentoDto.nIdVentaUtilizado=0;


        }

      }
      else{
        this.saldoDisponible=0;
        this.restan=this.ventaSaldoFavor.nSaldoTotal;
        this.fProducto.monto.setValue((this.ventaSaldoFavor.nSaldoTotal).toFixed(3));
          this.formulario.controls.monto.disable();
          this.VentaDescuentoDto.nSaldoFavor=0;
          this.VentaDescuentoDto.nIdVentaUtilizado=0;
        
        


      }  

   })
  }

  }

  


  consultaVentas() {

    this.ventasService.obtenerVentaDetalleEstatusVenta(1).subscribe(data => {
      this.listaVentasDetalleCliente = data;
      if (this.listaVentasDetalleCliente.length > 0) {
        this.displayListaVentas=false;
      }else{
        this.displayListaVentas=true;
      }
      //console.log(this.listaVentasDetalleCliente);

    });
  }

  detalleVentaProductos(tvVentasDetalle: TvVentasDetalle) {



    this.ventasService.obtenerProductoVentaId(tvVentasDetalle.nId).subscribe(data => {
      this.listaProductosVenta = data;
      this.mostrarProductos = true;
      //console.log(this.listaProductosVenta);
    })

  }

  generarVentaPdf(tvVentasDetalle: TvVentasDetalle) {

    this.ventasService.generarVentaPdf(tvVentasDetalle.nId).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
     // console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'venta_' + tvVentasDetalle.nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'comprobante de venta Generado', life: 3000 });
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000 });
      }

    });

  }

  obtenerCatalogoFormPago(){
    this.catalogo.obtenerFormaPago().subscribe(data => {
      this.listaFormaPago = data;
    });
  }


  abrir(tvVentasDetalle: TvVentasDetalle) {
    this.abrirformulario = true;
   // console.log('Este es el objeto de información', tvVentasDetalle);
    // console.log('Este es el objeto de información', tvVentasDetalle.nSaldoFavor);


    this.ventaSaldoFavor=tvVentasDetalle;

    if(tvVentasDetalle.nIdTipoVenta===3){
      this.state=true;

    }
    else{
      this.state=false;

    }
   

  this.ventasService.obtenerCobroParcial(tvVentasDetalle.nId).subscribe(resp => {

    this.listaCobrosParciales = resp;
    //console.log('listaCobroParcial',this.listaCobrosParciales);

    if (this.listaCobrosParciales.length >0) {
      this.displayListaAbonoVenta=false;
    } else {
      this.displayListaAbonoVenta=true;
    }

    /* Se bloquea el campo de monto con el total de la venta sin opción a modificar el monto  */
    if (tvVentasDetalle.tcTipoVenta.nId !== 3) {
  
      this.fProducto.monto.setValue(tvVentasDetalle.nSaldoTotal.toFixed(3));
      this.formulario.controls.monto.disable();
      
    }   
  
  
    /*Se valida que no hay registro de pago de apartado y se habilita el campo de comto para escribir el monto a pagar considerando que sea mayor al 50% */
    if (tvVentasDetalle.tcTipoVenta.nId === 3 && this.listaCobrosParciales.length == 0) {
  
      //console.log("Entre a asignar el valor de anticipo");
      this.fProducto.monto.setValue(tvVentasDetalle.nAnticipo.toFixed(3));
      this.VentaDescuentoDto.nSaldoFavor=0;
      this.VentaDescuentoDto.nIdVentaUtilizado=0;
      this.formulario.controls.monto.enable();
    }
  
    /*Con este modulo se valida si ya hay un registro de anticipo en la caja y se asigna ñla diferecia para su cobro */
    if (tvVentasDetalle.tcTipoVenta.nId === 3 && this.listaCobrosParciales.length > 0) {
  
      this.VentaDescuentoDto.nSaldoFavor=0;
      this.VentaDescuentoDto.nIdVentaUtilizado=0;
      this.fProducto.monto.setValue((tvVentasDetalle.nSaldoTotal).toFixed(3));
      this.formulario.controls.monto.enable();
  
    }
  });



   /*Se obtiene  el catalogo de formas de pago */
    this.obtenerCatalogoFormPago();

    this.noVenta = tvVentasDetalle.nId;
    this.totalVenta = tvVentasDetalle.nTotalVenta;
    this.aCuenta=tvVentasDetalle.nAvancePago;
    this.restan=tvVentasDetalle.nSaldoTotal;
    this.VentaDescuentoDto = tvVentasDetalle; 
  


  }

  crearFormulario() {

    this.formulario = this.fb.group({


      idFormaPago: ['', [Validators.required]],
      monto: ['', [Validators.required]],

    });

  }
  cerrarModal() {
    this.abrirformulario = false;

    this.limpiaFormulario();
    this.saldoFavor=null;
    this.saldoTotalFavor=null;
    this.saldoDisponible=null;

  }
  limpiaFormulario() {

    this.fProducto.idFormaPago.setValue("");
    this.fProducto.monto.setValue("");
  }


  get validaFormaPago() {
    return this.formulario.get('idFormaPago').invalid && this.formulario.get('idFormaPago').touched;
  }
  get validaMonto() {
    return this.formulario.get('monto').invalid && this.formulario.get('monto').touched;
  }


  get fProducto() {
    return this.formulario.controls;
  }

  cobrarVenta() {

    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach(control => {

        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable

          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }

      });

    }
    else {


     // console.log(this.VentaDescuentoDto);


      let con1 = this.catalogo.obtenerFormaPagoId(this.formulario.get('idFormaPago').value);
      let con2 = this.catalogo.obtenerEstatusVentaId(2);


      forkJoin([con1, con2]).subscribe(data => {

        this.VentaDescuentoDto.tcFormapago = data[0];
        this.VentaDescuentoDto.tcEstatusVenta = data[1];

        this.guardarCobro();
        this.limpiaFormulario();
        this.abrirformulario = false;


      });







    }


  }

  guardarCobro() {

    //console.log("Esto es el objeto que se estará insertando");
    
    
    this.VentaDescuentoDto.nAnticipo= this.fProducto.monto.value;
   // console.log(this.VentaDescuentoDto);

    if(this.VentaDescuentoDto.nSaldoFavor===null || this.VentaDescuentoDto.nSaldoFavor===undefined ){

      this.VentaDescuentoDto.nSaldoFavor=0;

    }

    
    this.ventasService.guardaVentaDetalle(this.VentaDescuentoDto).subscribe(data => {

      this.consultaVentas();

      this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se guardo el cobro de la venta', life: 3000 });


    });




  }

  cajaActual(){

      this.catalogo.obtenerCajaActiva().subscribe(data=>{

        this.cajaActiva=data;

    })

  }

  generarBalance(){

  

    this.ventasService.generarBalanceCajaPdf(this.cajaActiva.nId).subscribe(resp => {


      const file = new Blob([resp], { type: 'application/pdf' });
     // console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'reporte_caja_' + '1' + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Balance de caja Generado', life: 3000 });
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 

      } else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el balance de la caja', life: 3000 });
      }

    });





  }

  verBalance() {

    this.mostrarBalance = true;

  }

  cerrarBalance() {
    this.mostrarBalance = false;

  }

  hideDialogAlter() {
    this.mostrarProductos = false;
  }


}





















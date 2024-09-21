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
import { TwSaldoUtilizado } from 'src/app/productos/model/TwSaldoUtilizado';
import { UsuarioService } from '../../../administracion/service/usuario.service';
import { TokenService } from 'src/app/shared/service/token.service';

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
  error:boolean;
  descuento:boolean;
  totalDescuento:number;
  saldoUtilizado:TwSaldoUtilizado;
  ventaCobro:TrVentaCobro;
  twVenta:TwVenta;
  banGuardar:boolean;

  constructor(private messageService: MessageService, private ventasService: VentasService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private catalogo: CatalogoService,   private tokenService: TokenService,) {

    this.listaCobrosParciales = [];
    this.displayListaVentas=false;
    this.displayListaAbonoVenta=false;
    this.error=false;
    this.saldoUtilizado=new TwSaldoUtilizado();
    this.ventaCobro=new TrVentaCobro();
    this.totalVenta=0;
    this.aCuenta=0;
    this.restan=0;
    this.banGuardar=true;
  }

  ngOnInit() {

    this.crearFormulario();
    this.consultaVentas();
    this.cajaActual();  
    this.obtenerCatalogoFormPago();

  }


  consultarVentaSaldo(){
    this.saldoTotalFavor=null;
   //console.log('voy a consultar si hay un saldo a favor:', this.saldoFavor);

    if (this.saldoFavor != null || this.saldoFavor != undefined) {
      this.ventasService.obtenerSaldoVentaFavor(this.saldoFavor).subscribe(data => {
        this.saldoTotalFavor = data;
        
        if(this.saldoTotalFavor==null){
          this.error = true;
        }
        else{
          this.error = false;
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

  guardaSaldoUtilizado(twSaldoUtilizado:TwSaldoUtilizado){



  this.ventasService.guardaSaldoUtilizado(twSaldoUtilizado).subscribe(data=>{

    this.consultarVentaSaldo();
    this.generarsSaldoFacorPdf(twSaldoUtilizado.nIdVenta);

  })


  }

  guardaVentaCobro(trVentaCobro:TrVentaCobro){

  

    this.ventasService.guardaVentaCobro(trVentaCobro).subscribe(data=>{
     
      this.consultaPagosParciales(data.nId);

      this.banGuardar=true;

      

    })


  }

  aplicarSaldoFavor(){
    
    // Se mapea el objeto de saldo utilizado para guardar el registro
    if(this.saldoTotalFavor.nSaldoDisponible>=this.ventaSaldoFavor.nSaldoTotal){
       this.saldoUtilizado.nSaldoUtilizado=this.ventaSaldoFavor.nSaldoTotal;
       this.saldoUtilizado.nSaldoTotal=this.ventaSaldoFavor.nSaldoTotal;
       this.ventaCobro.nMonto=this.ventaSaldoFavor.nSaldoTotal;
       this.saldoUtilizado.nSaldoUtilizado.toFixed(2);
       this.saldoUtilizado.nSaldoTotal.toFixed(2);
       this.ventaCobro.nMonto.toFixed(2);
        

         }
   else{
       this.saldoUtilizado.nSaldoUtilizado=this.saldoTotalFavor.nSaldoDisponible;
       this.saldoUtilizado.nSaldoTotal=this.saldoTotalFavor.nSaldoDisponible;
       this.ventaCobro.nMonto=this.saldoTotalFavor.nSaldoDisponible;
       this.saldoUtilizado.nSaldoUtilizado.toFixed(2);
       this.saldoUtilizado.nSaldoTotal.toFixed(2);
       this.ventaCobro.nMonto.toFixed(2);
     

      }        
        this.saldoUtilizado.nIdVenta=this.saldoFavor;
        this.saldoUtilizado.nIdUsuario=this.tokenService.getIdUser();
        this.saldoUtilizado.nEstatus=true;
        this.saldoUtilizado.dFecha=new Date();
        this.saldoUtilizado.nIdCaja=this.cajaActiva.nId;
        this.saldoUtilizado.nIdVentaUtilizado=this.ventaSaldoFavor.nId;

       // Se guarda    
       this.guardaSaldoUtilizado( this.saldoUtilizado);
       
       this.ventaCobro.nIdVenta=this.ventaSaldoFavor.nId;
       this.ventaCobro.nIdCaja=this.cajaActiva.nId;
       this.ventaCobro.dFecha=new Date();
       this.ventaCobro.nEstatus=1;
       this.ventaCobro.nIdFormaPago=11;
     
       
       this.guardaVentaCobro(this.ventaCobro);

      
     





  }

  limpiar(){
    this.noVenta = 0
    this.totalVenta = 0;     
    this.restan = 0;
    this.VentaDescuentoDto = new TvVentasDetalle();
    this.totalDescuento=0;
    this.fProducto.monto.setValue(0);
    this.aCuenta=0;
   


  }

  consultaPagosParciales(nIdVenta:number){

    this.limpiar();
    this.banGuardar=false;



    this.ventasService.obtenerCobroParcial(this.ventaSaldoFavor.nId).subscribe(resp => {
      this.listaCobrosParciales = resp;
      let formapago:number;

      if (this.listaCobrosParciales.length > 0) {
        this.displayListaAbonoVenta = false;
      } else {
        this.displayListaAbonoVenta = true;
      }


      for(let i in this.listaCobrosParciales ){
        this.aCuenta+=this.listaCobrosParciales[i].nMonto;
        
     }
  
     this.noVenta = this.ventaSaldoFavor.nId;
     this.totalVenta = this.ventaSaldoFavor.nTotalVenta;     
     this.restan = this.ventaSaldoFavor.nTotalVenta-this.aCuenta-this.ventaSaldoFavor.descuento;
     this.VentaDescuentoDto = this.ventaSaldoFavor;
     this.totalDescuento=this.ventaSaldoFavor.descuento;
     this.fProducto.monto.setValue(this.restan.toFixed(2));

    if(this.ventaSaldoFavor.nIdTipoVenta === 3){      

      if(this.restan==this.ventaSaldoFavor.nTotalVenta){

        this.fProducto.monto.setValue(this.restan/2);
      }        
     
    }
   /* if(this.ventaSaldoFavor.nIdTipoVenta !== 3){   

    this.formulario.controls.monto.disable();
    } */





     this.consultaVentas();

      if(this.restan<=0.01){
        this.ventasService.obtnerVentaId(this.ventaSaldoFavor.nId).subscribe(data=>{        
          this.twVenta=data;
          this.twVenta.nIdEstatusVenta=2; 
          this.abrirformulario = false;
         
          if (this.listaCobrosParciales.length==1) {       
          this.twVenta.nIdFormaPago=this.listaCobrosParciales[0].nIdFormaPago;
          } 
          if (this.listaCobrosParciales.length==2) {       
            this.twVenta.nIdFormaPago=20;
          } 

          this.ventasService.guardarVentaCompleta(this.twVenta).subscribe(data=>{


            this.messageService.add({ severity: 'success', summary: 'Correcto', detail: 'Se guardo el cobro', life: 3000 });

            this.limpiaFormulario();         
            this.consultaVentas();
            this.saldoTotalFavor=null;
            this.saldoFavor=null;
           

          })


        })
      }

      this.banGuardar=true;

  
    })

    





  }


  abrir(nId: number) {

    this.abrirformulario = true;
    this.ventasService.consultaVentaDetalleId(nId).subscribe(data => {
      this.ventaSaldoFavor = data;


      if (this.ventaSaldoFavor.nIdTipoVenta === 3) {
        this.state = true;

      }
      else {
        this.state = false;

      }
      if(this.ventaSaldoFavor.descuento>0){
        this.descuento=true;

      }
      else{
        this.descuento=false;
      }

     
      
     this.consultaPagosParciales(this.ventaSaldoFavor.nId);

     


    })

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


    
        this.limpiaFormulario();
        this.abrirformulario = false;









    }


  }

  guardarCobro() {

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

      if ((this.fProducto.monto.value - this.restan)>=0.01) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'El total a pagar no puede ser mayor al adeudo', life: 3000 });
      }
      else {



        this.ventaCobro.nIdVenta = this.ventaSaldoFavor.nId;
        this.ventaCobro.nIdCaja = this.cajaActiva.nId;
        this.ventaCobro.dFecha = new Date();
        this.ventaCobro.nEstatus = 1;
        this.ventaCobro.nIdFormaPago = this.fProducto.idFormaPago.value;
        this.ventaCobro.nMonto = this.fProducto.monto.value;
        // this.ventaCobro.nMonto.toFixed(2);

       
        
        this. banGuardar=false;

        this.guardaVentaCobro(this.ventaCobro);

      }



    }



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


  generarsSaldoFacorPdf(nId:number){

    this.ventasService.generarSaldoFavorPdf(nId).subscribe(resp => {
  
    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'saldo_favor_' + nId + '.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Comprobante de saldo a favor generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de saldo a favor', life: 3000});
      }
  
  });
  
  }

  generarVentaPedidoPdf(tvVentasDetalle:TvVentasDetalle){

    this.ventasService.generarVentaPedidoPdf(tvVentasDetalle.nId).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
        //console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'venta_' + tvVentasDetalle.nId + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'comprobante de venta Generado', life: 3000});
          //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
         
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
        }
  
    });
  
  }
  
  
  
  


}





















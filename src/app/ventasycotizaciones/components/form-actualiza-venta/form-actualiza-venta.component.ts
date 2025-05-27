import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { disable } from 'colors';
import Decimal from 'decimal.js';
import { MessageService } from 'primeng/api';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Clientes } from 'src/app/administracion/interfaces/clientes';
import { ClienteService } from 'src/app/administracion/service/cliente.service';
import { UsuarioService } from 'src/app/administracion/service/usuario.service';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { TwVenta } from 'src/app/productos/model/TwVenta';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-form-actualiza-venta',
  templateUrl: './form-actualiza-venta.component.html',
  styleUrls: ['./form-actualiza-venta.component.scss']
})
export class FormActualizaVentaComponent implements OnInit {
  
  @Input() nIdVenta: number;
  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();

  formulario:FormGroup;
  mostrarSugerencias:boolean;
  twVenta:TwVenta;
  mostrarSugerenciasCliente:boolean=false;
  mostrarDetalleCliente:boolean=false;
  debuncerCliente: Subject<string> = new Subject();
  listaCliente: Clientes[]=[];
  formGrp: FormGroup;
  cliente:string;
  clienteDialog: boolean;
  objCliente:Clientes=undefined;
  clienteSeleccionado:Clientes;
  productosFiltrados: TvStockProducto[]=[];
  btn:boolean=true;

  constructor(private fb: FormBuilder, 
              private catalogoService: CatalogoService, 
              private ventasService: VentasService, 
              private messageService: MessageService,
              private usuarioService: UsuarioService,
              private clienteService: ClienteService,
              private tokenService: TokenService, 
              
            
            ) {
               
                this.twVenta=new TwVenta();
          


               }

  ngOnInit(): void {
    this.crearFormulario();
    this.consultaVenta(this.nIdVenta);

    this.ventasService.obtnerVentaId(this.nIdVenta).subscribe(data=>{

      this.twVenta=data;
     /*Se asigna el valor de la venta al campo */
      this.validanId.setValue(this.nIdVenta);
      /*Se bloquea el campo de venta */
      this.formGrp.get('nId').disable();  
      /*Se asigna el valor de razon social */
      this.clienteCtrl.setValue(this.twVenta.tcCliente.sRazonSocial);
      this.saldoCtrl.setValue(this.twVenta.nSaldo);
      this.cajaCtrl.setValue(this.twVenta.nIdCaja);
      this.clienteSeleccionado=this.twVenta.tcCliente;
      
    
    
      });

  }

  inputCliente(){ 

    this.mostrarDetalleCliente=false;

    if (this.clienteCtrl.valid) {


      if(this.clienteCtrl.value.length>5){
        this.clienteService.obtenerClientesLike(this.clienteCtrl.value).subscribe(cliente => {
          if (cliente.length != 0) {
            this.listaCliente=cliente;
            this.mostrarSugerenciasCliente=true;
            this.messageService.add({severity: 'info', summary: 'Se encontraron coincidenicas', detail: 'Clientes encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasCliente=false;
            this.messageService.add({severity: 'warn', summary: 'No se encontraron coincidencias', detail: 'Cliente no encontrado, Verifique la información.', life: 3000});
          }      
        })

      }
  
   


    }else{
      this.mostrarSugerenciasCliente=false;
    }  
  }

  buscaCliente(){
    
    this.debuncerCliente
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.clienteService.obtenerClientesLike(valor).subscribe(cliente => {
          if (cliente.length != 0) {
            this.listaCliente=cliente;
            this.mostrarSugerenciasCliente=true;
            this.messageService.add({severity: 'info', summary: 'Se encontraron coincidenicas', detail: 'Clientes encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasCliente=false;
            this.messageService.add({severity: 'warn', summary: 'No se encontraron coincidencias', detail: 'Cliente no encontrado, Verifique la información.', life: 3000});
          }      
        })
      });
}

  crearFormulario() {
  
    this.formGrp=new FormGroup({
      nId: new FormControl('', [Validators.required], ),
      clienteCtrl: new FormControl('',[Validators.required,Validators.minLength(3)]),  
      clienteSeleccionadoCtrl: new FormControl('', []),
      saldoCtrl:new FormControl('', [] ),
      cajaCtrl:new FormControl('', [Validators.required] )

     
    });


    
  }

  consultaVenta(venta:number){
    
  

  this.ventasService.obtnerVentaId(venta).subscribe(data=>{

  this.twVenta=data;


  })



  }

  valorSeleccionadoCliente(){

  this.productosFiltrados=[];
  this.mostrarSugerenciasCliente=false;
  this.clienteSeleccionado=this.clienteSeleccionadoCtrl.value;
  this.clienteCtrl.setValue(this.clienteSeleccionado.sRazonSocial);
  this.twVenta.tcCliente=this.clienteSeleccionado;
  this.twVenta.nIdCliente=this.clienteSeleccionado.nId;


  

  }

  cerrarModal(){




    this.cerrar.emit(false);


  }

  limpiar(){
    
    this.clienteSeleccionado=null;
   this.twVenta=null;
   this.formGrp=null;
   this.cajaCtrl.setValue('');
   this.saldoCtrl.setValue('');
   this.clienteSeleccionadoCtrl.setValue('');
   this.validanId.setValue('');
    

  }

  saveProduct(){

    this.btn=false;

    if (this.formGrp.invalid) {
  
      return Object.values(this.formGrp.controls).forEach(control => {

        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable
          
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }

      });
    }else{

      
      this.twVenta.tcCliente=this.clienteSeleccionado;
      this.twVenta.nIdCliente=  this.clienteSeleccionado.nId;
      this.twVenta.nIdCaja= this.cajaCtrl.value;
      this.twVenta.nSaldo=this.saldoCtrl.value;

      
      this.catalogoService.consultaCajaId(this.cajaCtrl.value).subscribe(data=>{

        /*Se consultan los servicios de consulta de total de venta y saldo general del cliente */
        forkJoin([this.ventasService.consultaVentaDetalleId(this.twVenta.nId),  this.clienteService.obtenerSaldoGeneralCliente(this.twVenta.tcCliente.nId)]).subscribe(
          ([resultadoServicio1, resultadoServicio2]) => {
            
         
            
            /*Si la venta es crédito */
            if(this.twVenta.nTipoPago==1){

                        /*Se obtiene el monto total de la venta*/
                      let totalVenta= new Decimal('0');
                     let  saldoDisponible=new Decimal('0');
                      totalVenta=resultadoServicio1.nTotalVenta;

                        if(resultadoServicio2!=null || resultadoServicio2!=undefined ){

                          saldoDisponible=resultadoServicio2.nCreditoDisponible;
            
                        }                     
            
                        if((resultadoServicio2==null || resultadoServicio2==undefined) && this.twVenta.tcCliente.n_limiteCredito.greaterThan(0) ){
            
                          saldoDisponible=this.twVenta.tcCliente.n_limiteCredito;
            
                        }
                        

           

               if(saldoDisponible>totalVenta){

                
                this.ventasService.guardarVentaCompleta(this.twVenta).subscribe(data=>{       
                  this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Se guardo la actualización ', life: 8000});
                  
                  this.cerrar.emit(false);
                });



               }
               else{
                this.btn=true;

                this.messageService.add({severity: 'error', summary: 'Error', detail: 'La venta es por:'+totalVenta+' y el saldo disponible es de:'+saldoDisponible +' favor de verificar', life: 8000});


               }



             }



             else{
               

              /*Si no es una venta a credito se guarda  */
              this.ventasService.guardarVentaCompleta(this.twVenta).subscribe(data=>{       
                this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Se guardo la actualización ', life: 8000});
                 
                 this.cerrar.emit(false);
              
              });


             }




          
          },
          error => {
           
            console.error('Error al ejecutar los servicios:', error);
          }
        );











      });





      

      
     
    }

    



  }

  teclaPresionada(){

  }

  get clienteCtrl(){
    return this.formGrp.get('clienteCtrl') as FormControl;
  }

  get validanId(){
    return this.formGrp.get('nId') as FormControl;
  }

  get clienteSeleccionadoCtrl(){
    return this.formGrp.get('clienteSeleccionadoCtrl') as FormControl;
  }

  get saldoCtrl(){
    return this.formGrp.get('saldoCtrl') as FormControl;
  }

  get cajaCtrl(){
    return this.formGrp.get('cajaCtrl') as FormControl;
  }
 
 

}

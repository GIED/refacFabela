import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClienteService } from 'src/app/administracion/service/cliente.service';
import { UsuarioService } from 'src/app/administracion/service/usuario.service';
import { TcGasto } from 'src/app/productos/model/TcGasto';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TwGasto } from '../../../productos/model/TwGasto';
import { TwCaja } from 'src/app/productos/model/TwCaja';

@Component({
  selector: 'app-form-gastos',
  templateUrl: './form-gastos.component.html',
  styleUrls: ['./form-gastos.component.scss']
})
export class FormGastosComponent implements OnInit {

  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  
  formulario: FormGroup;
  listaCategoriaGasto:TcGasto[];
  twGasto:TwGasto;
  cajaActiva:TwCaja;
  

  constructor(

    private catalogoService: CatalogoService,
    private productosService: ProductoService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) { 

    this.crearFormulario();
    this.listaCategoriaGasto=[];
    this.twGasto=new TwGasto();


  }

  ngOnInit(): void {
    this.catalogoGastos();
    this.obtenerGastosCaja()
  }

  


  crearFormulario(){

   this.formulario=this.fb.group({
    nMonto: ['', [Validators.required]],
    sDescripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    nCategoriaGasto: ['', [Validators.required]],

   })

  }

  obtenerGastosCaja(){

    this.catalogoService.obtenerCajaActiva().subscribe(data=>{

      this.cajaActiva=data;      

  })

  }

  catalogoGastos(){

   this.catalogoService.obtenerCatalogoGastos().subscribe(data=>{
      
    this.listaCategoriaGasto=data;

   })


  }

  get validaMonto() {
    return this.formulario.get('nMonto').invalid && this.formulario.get('nMonto').touched;
  }

  get validaCategoriaGasto() {
    return this.formulario.get('nCategoriaGasto').invalid && this.formulario.get('nCategoriaGasto').touched;
  }

  get validaDescripcion() {
    return this.formulario.get('sDescripcion').invalid && this.formulario.get('sDescripcion').touched;
  }

  get fcGasto() {
    return this.formulario.controls
  }

  hideDialog() {

    this.cerrar.emit(true);
  }


  guardar(){


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

      this.twGasto.nMonto=this.fcGasto.nMonto.value;
      this.twGasto.sDescripcion=this.fcGasto.sDescripcion.value;
      this.twGasto.nEstatus=1;
      this.twGasto.nIdGasto=this.fcGasto.nCategoriaGasto.value;
      this.twGasto.nIdCaja=this.cajaActiva.nId;
      this.twGasto.nIdUsuario=this.tokenService.getIdUser();
      this.twGasto.nId=null;
      this.twGasto.dFecha=new Date();


      

      this.catalogoService.guardarGasto(this.twGasto).subscribe(data=>{

      this.twGasto=data;     
      this.cerrar.emit(true);
      
      this.messageService.add({severity: 'info', summary: 'Registro guardado', detail: 'Se guardo el gasto', life: 3000});

      })


      

     


    }

  }

}

import { TcProducto } from './../../model/TcProducto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TcGanancia } from '../../model/TcGanancia';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcCategoriaGeneral } from '../../model/TcCategoriaGeneral';
import { MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { TcCategoria } from '../../model/TcCategoria';
import { TcClavesat } from '../../model/TcClavesat';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductoService } from '../../../shared/service/producto.service';
import { producto } from '../../interfaces/producto.interfaces';

interface Moneda {
  name: string,
  code: string
}

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styles: [
  ]
})
export class ModalProductoComponent implements OnInit {

  @Input() productDialog: boolean;
  @Input() titulo:string;
  

  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Output() guardarProducto: EventEmitter<TcProducto> = new EventEmitter();

  formulario:FormGroup;

  tcProducto:TcProducto;

  listaMoneda: Moneda[];
  listaCategoriaGeneral:TcCategoriaGeneral[];
  listaCategoria:TcCategoria[];
  listaClaveSat:TcClavesat[];
  listaGanancia:TcGanancia[];
  listaNoParte:TcProducto[];
  debuncer: Subject<string> = new Subject();
  mostrarSugerencias:boolean=false;

  constructor(private fb: FormBuilder, 
              private catalogoService: CatalogoService, 
              private productosService: ProductoService, 
              private messageService: MessageService, 
              private spinner: NgxSpinnerService) { 
    this.crearFormulario();
    this.listaMoneda =[
      {name: 'DOLAR', code:'DOLAR'},
      {name: 'PESO', code:'PESO'},
    ]
  }

  ngOnInit(): void {
    this.obtenerCategoriaGeneral();
    this.obtenerClaveSat();
    this.obtenerGanancia();
    this.buscaPorNoParte();
  }

  obtenerCategoriaGeneral(){
    this.spinner.show();
    this.catalogoService.obtenerCategoriaGeneral().subscribe(categoriaGeneral =>{
      this.listaCategoriaGeneral = categoriaGeneral;
      this.spinner.hide();
    })
  }

  obtenerCategoria(){
    this.spinner.show();
    if (this.fProducto.nidCategoriaGeneral.value == null) {
      this.formulario.get('nidCategoria').disable();
      this.spinner.hide();
    }else{
      this.catalogoService.obtenerCategoria(this.fProducto.nidCategoriaGeneral.value).subscribe(categoria =>{
        this.listaCategoria = categoria;
        this.formulario.get('nidCategoria').enable();
        this.spinner.hide();
      });

    }
  }

  obtenerClaveSat(){
    this.spinner.show();
    this.catalogoService.obtenerClaveSat().subscribe(claveSat => {
      this.listaClaveSat = claveSat;
      this.spinner.hide();
    })
  }

  obtenerGanancia(){
    this.spinner.show();
    this.catalogoService.obtenerGanancia().subscribe(ganancia =>{
      this.listaGanancia=ganancia;
      this.spinner.hide();
    })
  }

  get validaNoParte() {
    return this.formulario.get('sNoParte').invalid && this.formulario.get('sNoParte').touched;
  }
  get validaProducto() {
    return this.formulario.get('sProducto').invalid && this.formulario.get('sProducto').touched;
  }
  get validaMarca() {
    return this.formulario.get('sMarca').invalid && this.formulario.get('sMarca').touched;
  }
  get validaCategoria() {
    return this.formulario.get('nidCategoria').invalid && this.formulario.get('nidCategoria').touched;
  }
  get validaCategoriaGeneral() {
    return this.formulario.get('nidCategoriaGeneral').invalid && this.formulario.get('nidCategoriaGeneral').touched;
  }
  get validaPrecio() {
    return this.formulario.get('nPrecio').invalid && this.formulario.get('nPrecio').touched;
  }
  get validaMoneda() {
    return this.formulario.get('sMoneda').invalid && this.formulario.get('sMoneda').touched;
  }
  get validaGanancia() {
    return this.formulario.get('nIdGanancia').invalid && this.formulario.get('nIdGanancia').touched;
  }
  get validaClaveSat() {
    return this.formulario.get('nIdclavesat').invalid && this.formulario.get('nIdclavesat').touched;
  }

  crearFormulario() {
  
    this.formulario = this.fb.group({
        nId: ['',[]],
        sNoParte: ['',[Validators.required]],
        sProducto: ['',[Validators.required]],
        sDescripcion: ['',[]],
        sMarca: ['', [Validators.required]],
        nidCategoria:['',[Validators.required]],
        nidCategoriaGeneral:['',[Validators.required]],
        nPrecio:['',[Validators.required]],
        sMoneda:['',[Validators.required]],
        nIdGanancia:['',[Validators.required]],
        nIdusuario:['',[]],
        nEstatus:['',[]],
        dFecha:['',[]],
        nIdclavesat:['',[Validators.required]],
    })
    this.formulario.get('nidCategoria').disable();
  }

  cerrarModal() {
    this.productDialog=false;
    this.cerrar.emit(this.productDialog);
    this.fProducto.sNoParte.setValue("");
    this.limpiaFormulario();
    
  }

  saveProduct(){
    if (this.formulario.invalid) {
  
      return Object.values(this.formulario.controls).forEach(control => {

        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable
          
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }

      });
    }else{
      this.tcProducto = this.formulario.value;
      this.tcProducto.nEstatus=1;
      this.tcProducto.nIdusuario=1; 
      this.guardarProducto.emit(this.tcProducto);
      this.formulario.reset();
    }
  
  }

  editProducto(productoEditar: TcProducto, titulo?:string) {
    console.log('llego a editar');
    console.log(productoEditar);
    this.titulo=titulo;
    this.productDialog = true;
    this.fProducto.nId.setValue(productoEditar.nId);
    this.fProducto.sNoParte.setValue(productoEditar.sNoParte);
    this.fProducto.sProducto.setValue(productoEditar.sProducto);
    this.fProducto.sDescripcion.setValue(productoEditar.sDescripcion);
    this.fProducto.sMarca.setValue(productoEditar.sMarca);
    this.fProducto.nidCategoria.setValue(productoEditar.nidCategoria);
    this.fProducto.nidCategoriaGeneral.setValue(productoEditar.nidCategoriaGeneral);
    this.fProducto.nPrecio.setValue(productoEditar.nPrecio);
    this.fProducto.sMoneda.setValue(productoEditar.sMoneda);
    this.fProducto.nIdGanancia.setValue(productoEditar.nIdGanancia);
    this.fProducto.nIdusuario.setValue(productoEditar.nIdusuario);
    this.fProducto.nEstatus.setValue(productoEditar.nEstatus);
    this.fProducto.dFecha.setValue(productoEditar.dFecha);
    this.fProducto.nIdclavesat.setValue(productoEditar.nIdclavesat);
    this.obtenerCategoria();
    this.formulario.get('nidCategoria').enable();



    
}

limpiaFormulario() {
  this.fProducto.nId.setValue("");
  this.fProducto.sProducto.setValue("");
  this.fProducto.sDescripcion.setValue("");
  this.fProducto.sMarca.setValue("");
  this.fProducto.nidCategoria.setValue("");
  this.fProducto.nidCategoriaGeneral.setValue("");
  this.fProducto.nPrecio.setValue("");
  this.fProducto.sMoneda.setValue("");
  this.fProducto.nIdGanancia.setValue("");
  this.fProducto.nIdusuario.setValue("");
  this.fProducto.nEstatus.setValue("");
  this.fProducto.dFecha.setValue("");
  this.fProducto.nIdclavesat.setValue("");
  



  
}

teclaPresionada(){
  
  if (this.fProducto.sNoParte.value.length >=3) {

    this.debuncer.next(this.fProducto.sNoParte.value);
  }else{
    this.limpiaFormulario();
  }

  
}

buscaPorNoParte(){

  
    this.debuncer
      .pipe(debounceTime(300))
      .subscribe(valor => {
        this.spinner.show();
        this.productosService.obtenerNoParte(valor).subscribe(noParte => {
          console.log(noParte.length);
          if (noParte.length != 0) {
            this.listaNoParte=noParte;
            this.mostrarSugerencias=true;
            this.messageService.add({severity: 'info', summary: 'coincidencias', detail: 'hay números de parte que coinciden', life: 3000});
           
  
          }else{
            this.fProducto.sNoParte.setValue(valor);
            this.mostrarSugerencias=false;
            this.messageService.add({severity: 'warn', summary: 'no encontrado', detail: 'el número de parte no existe en la base de datos.', life: 3000});
          }

          this.spinner.hide()
        })
      })
  
  
}

valorSeleccionado(){
  console.log(this.fProducto.sNoParte.value);
  let noparte =this.fProducto.sNoParte.value;
  for (let i = 0; i < this.listaNoParte.length; i++) {
    const producto = this.listaNoParte[i];
    if (producto.sNoParte.indexOf(noparte) == 0) {
      console.log(producto);
      
        this.editProducto(producto);
        this.mostrarSugerencias=false;
    }
}
}



  get fProducto(){
    return this.formulario.controls;
}

}

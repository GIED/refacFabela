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
  @Input() submitted: boolean;
  @Input() titulo:string;
  @Input() productoEditar: TcProducto;

  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Output() guardarProducto: EventEmitter<TcProducto> = new EventEmitter();

  formulario:FormGroup;

  tcProducto:TcProducto;

  listaMoneda: Moneda[];
  listaCategoriaGeneral:TcCategoriaGeneral[];
  listaCategoria:TcCategoria[];
  listaClaveSat:TcClavesat[];
  listaGanancia:TcGanancia[];

  constructor(private fb: FormBuilder, private catalogoService: CatalogoService, private messageService: MessageService, private spinner: NgxSpinnerService) { 
    this.crearFormulario();
    this.listaMoneda =[
      {name: 'Dolar', code:'Dolar'},
      {name: 'Peso', code:'Peso'},
    ]
  }

  ngOnInit(): void {
    this.obtenerCategoriaGeneral();
    this.obtenerClaveSat();
    this.obtenerGanancia();
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
    if (this.fProducto.nIdCategoriaGeneral.value == null) {
      this.formulario.get('nIdCategoria').disable();
      this.spinner.hide();
    }else{
      this.catalogoService.obtenerCategoria(this.fProducto.nIdCategoriaGeneral.value).subscribe(categoria =>{
        this.listaCategoria = categoria;
        this.formulario.get('nIdCategoria').enable();
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
    return this.formulario.get('nIdCategoria').invalid && this.formulario.get('nIdCategoria').touched;
  }
  get validaCategoriaGeneral() {
    return this.formulario.get('nIdCategoriaGeneral').invalid && this.formulario.get('nIdCategoriaGeneral').touched;
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
    return this.formulario.get('nIdClaveSat').invalid && this.formulario.get('nIdClaveSat').touched;
  }

  crearFormulario() {
  
    this.formulario = this.fb.group({
        nId: ['',[]],
        sNoParte: ['',[Validators.required]],
        sProducto: ['',[Validators.required]],
        sDescripcion: ['',[]],
        sMarca: ['', [Validators.required]],
        nIdCategoria:['',[Validators.required]],
        nIdCategoriaGeneral:['',[Validators.required]],
        nPrecio:['',[Validators.required]],
        sMoneda:['',[Validators.required]],
        nIdGanancia:['',[Validators.required]],
        nIdUsuario:['',[]],
        nEstatus:['',[]],
        dFecha:['',[]],
        nIdClaveSat:['',[Validators.required]],
    })
    this.formulario.get('nIdCategoria').disable();
  }

  hideDialog() {
    this.cerrar.emit(false);
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
      this.guardarProducto.emit(this.tcProducto);
    }
  
  }

  editUsuario() {
    this.productDialog = true;
    this.fProducto.nId.setValue(this.productoEditar.nId);
    this.fProducto.sNoParte.setValue(this.productoEditar.sNoParte);
    this.fProducto.sProducto.setValue(this.productoEditar.sProducto);
    this.fProducto.sDescripcion.setValue(this.productoEditar.sDescripcion);
    this.fProducto.sMarca.setValue(this.productoEditar.sMarca);
    this.fProducto.nIdCategoria.setValue(this.productoEditar.tcCategoria.nId);
    this.fProducto.nIdCategoriaGeneral.setValue(this.productoEditar.tcCategoriaGeneral.nId);
    this.fProducto.nPrecio.setValue(this.productoEditar.nPrecio);
    this.fProducto.sMoneda.setValue(this.productoEditar.sMoneda);
    this.fProducto.nIdGanancia.setValue(this.productoEditar.tcGanancia.nId);
    this.fProducto.nIdUsuario.setValue(this.productoEditar.tcUsuario.nId);
    this.fProducto.nEstatus.setValue(this.productoEditar.nEstatus);
    this.fProducto.dFecha.setValue(this.productoEditar.nEstatus);
    this.fProducto.nIdClaveSat.setValue(this.productoEditar.tcClavesat.nId);


    
}

  get fProducto(){
    return this.formulario.controls;
}

}

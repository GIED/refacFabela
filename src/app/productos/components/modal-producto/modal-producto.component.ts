import { TcProducto } from './../../model/TcProducto';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { TcGanancia } from '../../model/TcGanancia';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcCategoriaGeneral } from '../../model/TcCategoriaGeneral';
import { MessageService } from 'primeng/api';
import { TcCategoria } from '../../model/TcCategoria';
import { TcClavesat } from '../../model/TcClavesat';
import { forkJoin, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ProductoService } from '../../../shared/service/producto.service';
import { UsuarioService } from '../../../administracion/service/usuario.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TcMarca } from '../../model/TcMarca';
import Decimal from 'decimal.js';

interface Moneda {
  name: string,
  code: string
}

@Component({
  selector: 'app-modal-producto',
  templateUrl: './modal-producto.component.html',
  styleUrls: ['./modal-producto.component.scss']
})
export class ModalProductoComponent implements OnInit {

  @Input() productDialog: boolean;
  @Input() titulo:string;
  @Input() producto:TcProducto;
  

  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Output() guardarProducto: EventEmitter<TcProducto> = new EventEmitter();

  formulario:FormGroup;

  tcProducto:TcProducto;
  tcProductoCalculo:TcProducto;

  listaMoneda: Moneda[];
  listaCategoriaGeneral:TcCategoriaGeneral[];
  listaCategoria:TcCategoria[];
  listaClaveSat:TcClavesat[];
  listaGanancia:TcGanancia[];
  listaNoParte:TcProducto[];
  debuncer: Subject<string> = new Subject();
  mostrarSugerencias:boolean=false;
  ganancia:number;
  precioFinal: Decimal=new Decimal('0');
  listaMarca:TcMarca[];
  noparte:string;
  edithBand:boolean=false;
  consultaProducto:TcProducto;

  constructor(private fb: FormBuilder, 
              private catalogoService: CatalogoService, 
              private productosService: ProductoService, 
              private messageService: MessageService,
              private usuarioService: UsuarioService,
              private tokenService: TokenService, 
              ) { 
    this.crearFormulario();
    this.listaMoneda =[
      {name: 'USD', code:'USD'},
      {name: 'PESO', code:'PESO'},
    ]
    this.listaNoParte=[];
 
  }

  ngOnInit(): void {

    this.formulario.get('nLargo')?.valueChanges.subscribe(() => this.calcularVolumen());
    this.formulario.get('nAlto')?.valueChanges.subscribe(() => this.calcularVolumen());
    this.formulario.get('nAncho')?.valueChanges.subscribe(() => this.calcularVolumen());
   
     this.buscaPorNoParte();
    const  observable1 = this.catalogoService.obtenerCategoriaGeneral();
    const  observable2 = this.catalogoService.obtenerClaveSat();
    const  observable3 =this.catalogoService.obtenerGanancia();   
    const  observable4 =  this.catalogoService.obtenerMarcas();
    const  observable5 = this.tokenService.getIdUser();
   

    forkJoin([observable1, observable2, observable3, observable4 ]).subscribe({
      next: ([resultado1, resultado2, resultado3, resultado4]) => {
        
        this.listaCategoriaGeneral = resultado1;
        this.listaClaveSat = resultado2;
        this.listaGanancia=resultado3;
        this.listaMarca=resultado4;

        if (this.producto != null) {
          this.editProducto(this.producto);
          this.fProducto.sNoParte.disable();
          this.edithBand=true;
          
          if(observable5==19 || observable5==8 ){
          
          }
          else{

            this.fProducto.sMarca.disable();
          this.fProducto.nIdMarca.disable();
          }
         

        }
        else{
        this.edithBand=false;
          }
      },
      error: error => {
        console.error('Error al ejecutar los observables', error);
      }
    });

  }

   /*CREACION DEL FORMULARIO */
    crearFormulario() {
  
    this.formulario = this.fb.group({
        nId: ['',[]],
        sNoParte: ['',[Validators.required]],
        sProducto: ['',[Validators.required]],
        sDescripcion: ['',[Validators.required]],
        sMarca: ['', [Validators.required]],
        nIdCategoria:['',[Validators.required]],
        nIdCategoriaGeneral:['',[Validators.required]],
        nPrecio:['',[Validators.required]],
        sMoneda:['',[Validators.required]],
        nIdGanancia: [null, [Validators.required, this.gananciaMayorACero()]],
        nIdusuario:['',[]],
        nEstatus:['',[]],
        dFecha:['',[]],
        nIdclavesat:['',[Validators.required]],
        sIdBar:['',[]],
        nIdDescuento:['0',[Validators.required]],
        nIdMarca:['',[Validators.required]],
        nPeso: [null, []],
        nLargo: [null, []],
        nAlto: [null, []],
        nAncho: [null, []],
        nVolumen: [null, []],
        sRutaImagen: ['', []],
        
    })
    this.formulario.get('nIdCategoria').disable();
  }









  private gananciaMayorACero(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valor = Number(control.value);
    return valor > 0 ? null : { gananciaInvalida: true };
  };
}
  obtenerMarcas(){
    this.catalogoService.obtenerMarcas().subscribe(data=> {

      this.listaMarca=data;
      //console.log(this.listaMarca);

    })
     

  }

 editarProducto() {
  this.catalogoService.obtenerMarcas().subscribe(data => {
    this.listaMarca = data;

    // Asigna nombre de la marca si se encuentra
    const marca = this.listaMarca.find(m => m.nId === this.producto.nIdMarca);
    if (marca) {
      this.fProducto.sMarca.setValue(marca.sMarca);
    } else {
      this.fProducto.sMarca.setValue(this.producto.sMarca);
    }

    // Asignación común de campos
    this.fProducto.sNoParte.setValue(this.producto.sNoParte);
    this.fProducto.sProducto.setValue(this.producto.sProducto);
    this.fProducto.sIdBar.setValue(this.producto.sIdBar);
    this.fProducto.nIdMarca.setValue(this.producto.nIdMarca);
    this.fProducto.nPeso.setValue(this.producto.nPeso);
    this.fProducto.nLargo.setValue(this.producto.nLargo);
    this.fProducto.nAlto.setValue(this.producto.nAlto);
    this.fProducto.nAncho.setValue(this.producto.nAncho);
    this.fProducto.nVolumen.setValue(this.producto.nVolumen);
    this.fProducto.sRutaImagen.setValue(this.producto.sRutaImagen);

    // Asegura que los campos estén habilitados si corresponde
    this.fProducto.sNoParte.enabled;
    this.fProducto.sMarca.enabled;
  });
}


 asignarMarca(event: any): void {
  const marcaSeleccionada = this.listaMarca.find(m => m.nId === event.value);
  if (marcaSeleccionada) {
    this.formulario.get('sMarca')?.setValue(marcaSeleccionada.sMarca);
  } else {
    this.formulario.get('sMarca')?.setValue('');
  }
}

 
 

  obtenerCategoriaGeneral(){
    //this.spinner2.show();
    this.catalogoService.obtenerCategoriaGeneral().subscribe(categoriaGeneral =>{
      this.listaCategoriaGeneral = categoriaGeneral;
      //this.spinner2.hide();
    })
  }
  calcularVolumen(): void {
  const largo = this.formulario.get('nLargo')?.value || 0;
  const alto = this.formulario.get('nAlto')?.value || 0;
  const ancho = this.formulario.get('nAncho')?.value || 0;
  const volumen = largo * alto * ancho;
  this.formulario.get('nVolumen')?.setValue(Number(volumen.toFixed(2)), { emitEvent: false });
}
  obtenerCategoria(){
    //this.spinner2.show();
    if (this.fProducto.nIdCategoriaGeneral.value == null) {
      this.formulario.get('nIdCategoria').disable();
      //this.spinner2.hide();
    }else{
      this.catalogoService.obtenerCategoria(this.fProducto.nIdCategoriaGeneral.value).subscribe(categoria =>{
        this.listaCategoria = categoria;
        this.formulario.get('nIdCategoria').enable();
        //this.spinner2.hide();
      });

    }
  }

  obtenerClaveSat(){
    //this.spinner2.show();
    this.catalogoService.obtenerClaveSat().subscribe(claveSat => {
      this.listaClaveSat = claveSat;
      //this.spinner2.hide();
    })
  }

  obtenerGanancia(){
    //this.spinner2.show();
    this.catalogoService.obtenerGanancia().subscribe(ganancia =>{
      this.listaGanancia=ganancia;
      //this.spinner2.hide();
    })
  }

  cerrarModal() {
    this.productDialog=false;
    this.cerrar.emit(this.productDialog);
    this.fProducto.sNoParte.setValue("");
   this.formulario.reset();
    
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
      this.tcProducto.nIdusuario=this.tokenService.getIdUser();    

      //console.log('Este el producto que voy a guardar',this.tcProducto);
      
      /*Si es edición de producto solo se guarda la información */
      if(this.edithBand){

        this.tcProducto.sNoParte=this.formulario.get('sNoParte').value;
        this.tcProducto.sMarca=this.formulario.get('sMarca').value;
        this.tcProducto.nIdMarca=this.formulario.get('nIdMarca').value;


        this.guardarProducto.emit(this.tcProducto);
        this.cerrarModal();


      }
      /*Si no es actualización de valida la exixtencia del producto */
      else

      {

       /* Se consulta  que el producto no exista en la base de datos */
        this.productosService.obtenerProductoNoParte(this.formulario.get('sNoParte').value).subscribe(data=>{        

          /* Si no exixte el producto guarda la información */
          if(data==null || data == undefined){
            //console.log(data);
            this.guardarProducto.emit(this.tcProducto);
            this.cerrarModal();         
          }
          /* Se manda mensaje de que no se puede guardar el producto */
          else{
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'El número ya existe, favor de verificar', life: 3000});
          }
        })




      }





      
    }
  
  }

  editProducto(productoEditar: TcProducto) {


    
    this.productDialog = true;
    this.fProducto.nId.setValue(productoEditar.nId);
    this.fProducto.sNoParte.setValue(productoEditar.sNoParte);
    this.fProducto.sProducto.setValue(productoEditar.sProducto);
    this.fProducto.sDescripcion.setValue(productoEditar.sDescripcion);
    this.fProducto.sMarca.setValue(productoEditar.sMarca);
    this.fProducto.nIdCategoria.setValue(productoEditar.nIdCategoria);
    this.fProducto.nIdCategoriaGeneral.setValue(productoEditar.nIdCategoriaGeneral);
    this.fProducto.nPrecio.setValue(productoEditar.nPrecio);
    this.fProducto.sMoneda.setValue(productoEditar.sMoneda);
    this.fProducto.nIdGanancia.setValue(productoEditar.nIdGanancia);
    this.fProducto.nIdusuario.setValue(productoEditar.nIdusuario);
    this.fProducto.nEstatus.setValue(productoEditar.nEstatus);
    this.fProducto.dFecha.setValue(productoEditar.dFecha);
    this.fProducto.nIdclavesat.setValue(productoEditar.nIdclavesat);    
    this.obtenerCategoria();
    this.formulario.get('nIdCategoria').enable();
    this.precioFinal=productoEditar.nPrecioConIva;
    this.fProducto.sIdBar.setValue(productoEditar.sIdBar);
    this.listaNoParte=[];
    this.fProducto.nIdDescuento.setValue(productoEditar.nIdDescuento);
    this.fProducto.nIdMarca.setValue(productoEditar.nIdMarca);
    this.calculaPrecioFinal();

}

limpiaFormulario() {
  this.fProducto.nId.setValue("");
  this.fProducto.sProducto.setValue("");
  this.fProducto.sDescripcion.setValue("");
  this.fProducto.sMarca.setValue("");
  this.fProducto.nIdCategoria.setValue("");
  this.fProducto.nIdCategoriaGeneral.setValue("");
  this.fProducto.nPrecio.setValue("");
  this.fProducto.sMoneda.setValue("");
  this.fProducto.nIdGanancia.setValue("");
  this.fProducto.nIdusuario.setValue("");
  this.fProducto.nEstatus.setValue("");
  this.fProducto.dFecha.setValue("");
  this.fProducto.nIdclavesat.setValue("");
  this.fProducto.sIdBar.setValue("");
  this.fProducto.nIdDescuento.setValue("");
  this.fProducto.nPeso.setValue("");
  this.fProducto.nLargo.setValue("");
  this.fProducto.nAlto.setValue("");
  this.fProducto.nAncho.setValue("");
  this.fProducto.nVolumen.setValue("");
  this.fProducto.sRutaImagen.setValue("");
   
}

teclaPresionada(){
  
  if (this.fProducto.sNoParte.value.length >=3) {
    this.debuncer.next(this.fProducto.sNoParte.value);
  }else{
    this.limpiaFormulario();
    this.mostrarSugerencias=false;
  }
 
}

buscaPorNoParte(){

  this.listaNoParte=[];
    this.debuncer
      .pipe(debounceTime(300))
      .subscribe(valor => {
        this.productosService.obtenerNoParte(valor).subscribe(noParte => {
     //     console.log(noParte.length);
          if (noParte.length != 0) {
            this.listaNoParte=noParte;
            this.mostrarSugerencias=true;
            this.messageService.add({severity: 'info', summary: 'Se encontraron coincidencias', detail: 'Hay números de parte que coincidan', life: 3000});
           
  
          }else{
            this.fProducto.sNoParte.setValue(valor);
            this.mostrarSugerencias=false;
            this.edithBand=false;
            
            this.messageService.add({severity: 'warn', summary: 'No se encontraron coincidencias', detail: 'el número de parte no existe en la base de datos.', life: 3000});
          }
        })
      })
  
  
}
/*
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
}*/

valorSeleccionado(){
  //console.log(this.fProducto.sNoParte.value);
  this.noparte =this.fProducto.sNoParte.value;  
  //console.log('antes',this.listaNoParte);   
 
    if(this.tokenService.getIdUser()==19 || this.tokenService.getIdUser()==8  ){
          this.fProducto.sNoParte.disable();
    }
    else{

      this.fProducto.sMarca.disable();
    this.fProducto.nIdMarca.disable();
    }
   this.edithBand=true;

for (let index = 0; index < this.listaNoParte.length; index++) {
  const producto = this.listaNoParte[index];   
  if(producto.sNoParte==this.noparte){
    //console.log(producto);
    this.editProducto(producto);
    this.mostrarSugerencias=false;
  } 
  
}
 
}

/*Se consulta el precio final */
calculaPrecioFinal():void{

 if (this.fProducto.nPrecio.valid  && this.fProducto.sMoneda.valid &&this.fProducto.nIdGanancia.valid) {
   this.productosService.simuladorPrecioProducto(this.tcProductoCalculo=this.formulario.value).subscribe(resp=>{
    this.tcProductoCalculo=resp;
    this.precioFinal=this.tcProductoCalculo.nPrecioConIva;
    this.precioFinal.toFixed(2); 
   });     
 } 
}


/*validacion de campos del formulario */
  get fProducto(){
    return this.formulario.controls;
}

 get validaNoParte() {
    return this.formulario.get('sNoParte').invalid && this.formulario.get('sNoParte').touched;
  }
  get validaProducto() {
    return this.formulario.get('sProducto').invalid && this.formulario.get('sProducto').touched;
  }
  get validaDescripcion() {
    return this.formulario.get('sDescripcion').invalid && this.formulario.get('sDescripcion').touched;
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
    return this.formulario.get('nIdclavesat').invalid && this.formulario.get('nIdclavesat').touched;
  }
  get validaBar() {
    return this.formulario.get('sIdBar').invalid && this.formulario.get('sIdBar').touched;
  }

  get validaDescuento() {
    return this.formulario.get('nIdDescuento').invalid && this.formulario.get('nIdDescuento').touched;
  }
  get validanIdMarca() {
    return this.formulario.get('nIdMarca').invalid && this.formulario.get('nIdMarca').touched;
  }


}

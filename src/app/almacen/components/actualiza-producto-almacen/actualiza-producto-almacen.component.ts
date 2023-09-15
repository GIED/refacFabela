import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/administracion/service/usuario.service';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { TokenService } from 'src/app/shared/service/token.service';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcMarca } from 'src/app/productos/model/TcMarca';
import { ProductService } from 'src/app/demo/service/productservice';
import { ProductoService } from 'src/app/shared/service/producto.service';

@Component({
  selector: 'app-actualiza-producto-almacen',
  templateUrl: './actualiza-producto-almacen.component.html',
  styleUrls: ['./actualiza-producto-almacen.component.scss']
})
export class ActualizaProductoAlmacenComponent implements OnInit {
  
  @Input() productDialog: boolean;
  @Input() titulo:string;
  @Input() producto:TcProducto;
  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  @Output() guardarProducto: EventEmitter<TcProducto> = new EventEmitter();

  formulario:FormGroup;
  tcProducto:TcProducto;
  listaMarca:TcMarca[];


  constructor(
    private messageService: MessageService,
    private tokenService: TokenService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private catalogoService: CatalogoService,
    private productoServive: ProductoService
  ) { 
    this.crearFormulario();
    this.productDialog=false;}

  ngOnInit(): void {
    
   this.editarProducto();
    



  }

  

  editarProducto(){
   
    this.catalogoService.obtenerMarcas().subscribe(data=> {
      this.listaMarca=data;
      console.log(this.listaMarca);
      if(this.producto.nIdMarca>0 ){
    
        for (let index = 0; index < this.listaMarca.length; index++) {
          if(this.listaMarca[index].nId==this.producto.nIdMarca){
    
            this.fProducto.sMarca.setValue(this.listaMarca[index].sMarca);
          }
               
        }
        this.fProducto.sNoParte.setValue(this.producto.sNoParte);
        this.fProducto.sProducto.setValue(this.producto.sProducto);
        this.fProducto.sIdBar.setValue(this.producto.sIdBar);
       this.fProducto.nIdMarca.setValue(this.producto.nIdMarca);
       this.fProducto.sNoParte.enabled
       this.fProducto.sMarca.enabled

    
       }
       else{
        this.fProducto.sNoParte.setValue(this.producto.sNoParte);
        this.fProducto.sProducto.setValue(this.producto.sProducto);
        this.fProducto.sMarca.setValue(this.producto.sMarca);
        this.fProducto.sIdBar.setValue(this.producto.sIdBar);
       this.fProducto.nIdMarca.setValue(this.producto.nIdMarca);
    
       
      
        this.fProducto.sNoParte.enabled
        this.fProducto.sMarca.enabled



       }
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
  get validaBar() {
    return this.formulario.get('sIdBar').invalid && this.formulario.get('sIdBar').touched;
  }
  get validanIdMarca() {
    return this.formulario.get('nIdMarca').invalid && this.formulario.get('nIdMarca').touched;
  }

  crearFormulario() {
  
    this.formulario = this.fb.group({           
     
        sNoParte: ['',[Validators.required]],
        sProducto: ['',[Validators.required]],
       
        sMarca: ['', [Validators.required]],           
       
        sIdBar:['',[]],
        nIdMarca: ['', [Validators.required]]           


      
        
    })
    
  }

  get fProducto(){
    return this.formulario.controls;
}

saveProduct(){

  this.producto.sProducto=this.fProducto.sProducto.value;
  this.producto.sIdBar=this.fProducto.sIdBar.value;
  this.producto.sMarca=this.fProducto.sMarca.value;
  this.producto.nIdMarca=this.fProducto.nIdMarca.value;

  this.productoServive.guardaProductoGeneral(this.producto).subscribe(data=>{
      
    this.producto=data;

    this.productDialog=false;
    this.cerrar.emit(this.productDialog);


  })



}

cerrarModal() {
  this.productDialog=false;
  this.cerrar.emit(this.productDialog);


}

asignarMarca(){

  if(this.fProducto.nIdMarca.value>0 ){
    
    for (let index = 0; index < this.listaMarca.length; index++) {
      if(this.listaMarca[index].nId==this.fProducto.nIdMarca.value){

        this.fProducto.sMarca.setValue(this.listaMarca[index].sMarca);
      }
           
    }
    


   }

  console.log("Este el valor seleccionado",this.fProducto.nIdMarca.value);


}

abrirmodal(){
  this.productDialog=false;
  
}


}

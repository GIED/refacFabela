import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TcProducto } from '../../model/TcProducto';
import { ProductoService } from '../../../shared/service/producto.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Proveedores } from '../../../administracion/interfaces/proveedores';
import { ProveedorService } from '../../../administracion/service/proveedor.service';
import { UsuarioService } from '../../../administracion/service/usuario.service';
import { TokenService } from '../../../shared/service/token.service';
import { PedidoDto } from '../../model/PedidoDto';
import { TwPedidoProducto } from '../../model/TwPedidoProducto';
import { PedidosService } from '../../../shared/service/pedidos.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TvPedidoDetalle } from '../../model/TvPedidoDetalle';

@Component({
  selector: 'app-alta-pedidos',
  templateUrl: './alta-pedidos.component.html',
  styleUrls: ['./alta-pedidos.component.scss']
})
export class AltaPedidosComponent implements OnInit {

  
  @Output() listaPedidoDetalle: EventEmitter<TvPedidoDetalle[]> = new EventEmitter();

  formGrp: FormGroup;

listaDetalleProducto:TcProducto[];
listaProducto:TcProducto[]; 
muestraDetalleProducto:boolean=false;
listaProveedores:Proveedores[];
listaProductosCompra:TwPedidoProducto[]=[];
tcPedidoProducto:TwPedidoProducto;
proveedor:Proveedores;
mostraarListaCompra:boolean=false;
pedidoDto: PedidoDto;


  constructor(private productoService: ProductoService,
     private proveedorService: ProveedorService, 
     private fb: FormBuilder,
      private usuarioService: UsuarioService,
       private tokenService: TokenService, 
       private pedidosService: PedidosService,
       private messageService: MessageService,  private confirmationService: ConfirmationService) { 
    this._initFormGroup();
    this.listaProducto=[];
    this.listaProveedores=[];
    this.listaProductosCompra=[];
    this.tcPedidoProducto= new TwPedidoProducto() ;
   this.pedidoDto=new PedidoDto();
  }

  ngOnInit() {
    this._initFormGroup();
  }

  _initFormGroup(){ 
    this.formGrp=this.fb.group({   
      nCantidadCtrl: ['',[Validators.required]],
      nIdProveedorCtrl: ['',[Validators.required]]
    });
    
  }

  informacionProducto(producto:TcProducto){    

    if(producto!=null){
      this.muestraDetalleProducto=true;
        this.listaProducto.push(producto);
     console.log(this.listaProducto);
     this.obtenerProveedores();
    }
  
  }
  get validanCantidadCtrl(){
    return this.formGrp.get('nCantidadCtrl').invalid  ;
  }
  get validanIdProveedorCtrl(){
    return this.formGrp.get('nIdProveedorCtrl').invalid;
  }

  get fProducto(){
    return this.formGrp.controls;
}

  limpiaFormulario(){   
    this.fProducto.nCantidadCtrl.setValue('');  
    this.fProducto.nIdProveedorCtrl.setValue('');  
  }

  agregarProduct(producto:TcProducto){
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

      for(let i in this.listaProveedores){
        if(this.listaProveedores[i].nId==this.fProducto.nIdProveedorCtrl.value)
          this.proveedor=this.listaProveedores[i];
  
        }    
      this.tcPedidoProducto.nId=null;    
      this.tcPedidoProducto.sClavePedido=this.crearId();
      this.tcPedidoProducto.dFechaPedido=null; 
      this.tcPedidoProducto.nMotivoPedido=1;
      this.tcPedidoProducto.nIdProducto=producto.nId;
      this.tcPedidoProducto.nCantidadPedida= this.fProducto.nCantidadCtrl.value;  
      this.tcPedidoProducto.nIdProveedor=this.fProducto.nIdProveedorCtrl.value;
      this.tcPedidoProducto.nCantidaRecibida=null;
      this.tcPedidoProducto.dFechaRecibida=null;
      this.tcPedidoProducto.nEstatus=0;
      this.tcPedidoProducto.sObservaciones=null;   
      this.tcPedidoProducto.nIdUsuario=this.tokenService.getIdUser(); 
      this.tcPedidoProducto.tcProducto=producto;      
      this.tcPedidoProducto.tcProveedore=this.proveedor;    
      this.tcPedidoProducto.tcUsuario=null;  

      this.listaProductosCompra.push(this.tcPedidoProducto);



      console.log(this.listaProductosCompra);

      if(this.listaProductosCompra.length>0){
      this.mostraarListaCompra=true;
      }   
      
      this.listaProducto=[];
      this.muestraDetalleProducto=false;
      this.limpiaFormulario();
      this.tcPedidoProducto=new TwPedidoProducto;

      this.messageService.add({ severity: 'success', summary: 'Producto agregado', detail: 'El producto fue agregado a la lista de compra', life: 6000 });
      
    }
  }

  quitarProducto(tcPedidoProducto: TwPedidoProducto){

console.log(tcPedidoProducto);
    
this.listaProductosCompra.splice(this.findIndexById(tcPedidoProducto.nIdProducto, this.listaProductosCompra),1);
this.messageService.add({ severity: 'success', summary: 'Producto eliminado', detail: 'El producto fue eliminado a la lista de compra', life: 6000 });


  }
  findIndexById(id: number, arreglo:TwPedidoProducto[]): number {
    let index = -1;
    for (let i = 0; i < arreglo.length; i++) {
        if (arreglo[i].nIdProducto === id) {
            index = i;
            break;
        }
    }
    return index;
  }

  obtenerProveedores() {
    this.proveedorService.getProveedores().subscribe(provedores => {
      this.listaProveedores = provedores;
      console.log(this.listaProveedores);
    })
  }

  crearId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 20; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  guardarPedido(){
    this.pedidoDto.nId=null;
     this.pedidoDto.nIdUsuario=this.tokenService.getIdUser();
     this.pedidoDto.sCvePedido=this.crearId();
     this.pedidoDto.dFechaPedido=null;
     this.pedidoDto.sObservaciones="";
     this.pedidoDto.nEstatus=0; 
     this.pedidoDto.dFechaPedidoCierre=null;      
     this.pedidoDto.twPedidoProducto=this.listaProductosCompra;


     console.log(this.pedidoDto);

     this.pedidosService.guardaPedido(this.pedidoDto).subscribe(data=>{
      this.messageService.add({ severity: 'success', summary: 'Pedido registrado', detail: 'El pedido fue registrado con éxito', life: 3000 });
     this.pedidoDto=data;
     
      this.cerrarNuevoPedido();
      this.generarVentaPdf( this.pedidoDto.nId);
      console.log(data);
     })




  }

  cerrarNuevoPedido(){
    

    this.pedidosService.obtenerPedidosDetalleEstatus(0).subscribe(data=>{
      this.listaPedidoDetalle.emit(data);
        
      })
  }

  generarVentaPdf(nId:number){

    console.log("Se va a generar el comprobante");

    this.pedidosService.generarPedidoPdf(nId).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
        console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'pedido_' +nId + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Comprobante de Pedido Generado', life: 6000});
          //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
         
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se puedo generar el comprobante del pedido', life: 6000});
        }
  
    });
  
  }

  
  

}

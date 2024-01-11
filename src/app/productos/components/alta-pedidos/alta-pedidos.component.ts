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
import { TvStockProducto } from '../../model/TvStockProducto';
import { TwPedido } from '../../model/TwPedido';
import { producto } from '../../interfaces/producto.interfaces';

@Component({
  selector: 'app-alta-pedidos',
  templateUrl: './alta-pedidos.component.html',
  styleUrls: ['./alta-pedidos.component.scss']
})
export class AltaPedidosComponent implements OnInit {

  
  @Output() listaPedidoDetalle: EventEmitter<TvPedidoDetalle[]> = new EventEmitter();
  @Input() pedidoConsultado:TwPedido;


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
productDialog:boolean;
titulo:string;
producto:TcProducto;
tvStockProducto:TvStockProducto;
twPedido:TwPedido;
twPedidoProducto:TwPedidoProducto;
listaPedidoProducto:TwPedidoProducto[];


  constructor(private productosService: ProductoService,
     private proveedorService: ProveedorService, 
     private fb: FormBuilder,
      private usuarioService: UsuarioService,
       private tokenService: TokenService, 
       private pedidosService: PedidosService,
       private messageService: MessageService,  private confirmationService: ConfirmationService) { 

    this.listaProducto=[];
    this.listaProveedores=[];
    this.listaProductosCompra=[];
    this.tcPedidoProducto= new TwPedidoProducto() ;
   this.pedidoDto=new PedidoDto();
   this.twPedido=new TwPedido();
   this.twPedidoProducto=new TwPedidoProducto();
   this.listaPedidoProducto=[];
   this.tvStockProducto=new TvStockProducto();
  }

  ngOnInit() {
    this._initFormGroup();



  if(this.pedidoConsultado===undefined){
    
    }
    else{
      this.twPedido=this.pedidoConsultado;
      this.obtenerlistaPedidoProducto();
    }
  }

  _initFormGroup(){ 
    this.formGrp=this.fb.group({   
      nCantidadCtrl: ['',[Validators.required]],
      nIdProveedorCtrl: ['',[Validators.required]]
    });
    
  }
  //Este metodo guarda el pedido en la tabla de tw_pedido
  guardarPedidoGeneral(twPedido:TwPedido){  
    this.pedidosService.guardaPedidoGeneral(twPedido).subscribe(data=>{
      this.twPedido=data;
      
    })
  }
   
  // Este metodo guarda los productos del pedido
  guardarPedidoProducto(twPedidoProducto:TwPedidoProducto){
    this.pedidosService.guardaPedidoProducto(twPedidoProducto).subscribe(data=>{
      this.twPedidoProducto=data;    
      this.listaProducto=[];
      this.muestraDetalleProducto=false;
      this.limpiaFormulario();
      this.twPedidoProducto=new TwPedidoProducto;
      this.obtenerlistaPedidoProducto();
      this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'El producto fue guardado', life: 6000 });

    })
  }

  obtenerlistaPedidoProducto(){

    this.pedidosService.obtenerProductosPedido(this.twPedido.nId).subscribe(data=>{
      this.listaPedidoProducto=data;
      this.mostraarListaCompra=true;

    })

  }

 

  
 registrarProductoPedido(producto:TcProducto){
    // se pre para el objeto de registro de producto
    this.twPedidoProducto.dFechaPedido=new Date();
    this.twPedidoProducto.nMotivoPedido=1;
    this.twPedidoProducto.nIdProducto=producto.nId;
    this.twPedidoProducto.nCantidadPedida= this.fProducto.nCantidadCtrl.value;  
    this.twPedidoProducto.nIdProveedor=this.fProducto.nIdProveedorCtrl.value;
    this.twPedidoProducto.nEstatus=false;
    this.twPedidoProducto.nIdUsuario=this.tokenService.getIdUser();

   // se valida si ya se guado el pedido general, si no se guarda
    if(this.twPedido.nId!=null || this.twPedido!=undefined){

      this.twPedido.nIdUsuario=this.tokenService.getIdUser();
      this.twPedido.sCvePedido=this.crearId();
      this.twPedido.dFechaPedido=new Date();
      this.twPedido.nEstatus=0; 
        
      // se guarda pedido general
      this.pedidosService.guardaPedidoGeneral(this.twPedido).subscribe(data=>{
        this.twPedido=data;

        this.twPedidoProducto.nIdPedido=this.twPedido.nId;
        this.twPedidoProducto.sClavePedido=this.twPedido.sCvePedido;
        // se guarda el pedido
        this.guardarPedidoProducto(this.twPedidoProducto);


      })

    }
    else{
      this.twPedidoProducto.nIdPedido=this.twPedido.nId;
      this.twPedidoProducto.sClavePedido=this.twPedido.sCvePedido;
      // se guarda el pedido
      this.guardarPedidoProducto(this.twPedidoProducto);
    }
 }




  informacionProducto(producto:TcProducto){    
  
    this.muestraDetalleProducto=true;

    if(producto!=null){
     this.productosService.obtenerTotalBodegasIdProducto(producto.nId).subscribe(data=>{
      this.tvStockProducto=data;
     })
     
        this.listaProducto.push(producto);
    // console.log(this.listaProducto);
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
   
  }

  // Se elimina el producto del pedido  
  quitarProducto(tcPedidoProducto: TwPedidoProducto){
  this.pedidosService.borrarProductoPedido(tcPedidoProducto).subscribe(data=>{
  this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'El producto fue eliminado a la lista de compra', life: 6000 });
  this.obtenerlistaPedidoProducto();
})


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
     // console.log(this.listaProveedores);
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

  

  cerrarNuevoPedido(){    

    this.pedidosService.obtenerPedidosDetalleEstatus(0).subscribe(data=>{
      this.listaPedidoDetalle.emit(data);        
      })
  }

  generarPedidoPdf(nId:number){

    //console.log("Se va a generar el comprobante");

    this.pedidosService.generarPedidoPdf(nId).subscribe(resp => {
  
      
        const file = new Blob([resp], { type: 'application/pdf' });
       // console.log('file: ' + file.size);
        if (file != null && file.size > 0) {
          const fileURL = window.URL.createObjectURL(file);
          const anchor = document.createElement('a');
          anchor.download = 'pedido_' +nId + '.pdf';
          anchor.href = fileURL;
          anchor.click();
          this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Comprobante de Pedido Generado', life: 6000});
          //una vez generado el reporte limproducto:TcProducto;pia el formulario para una nueva venta o cotización 
         
        } else {
          this.messageService.add({severity: 'error', summary: 'Error', detail: 'No se puedo generar el comprobante del pedido', life: 6000});
        }
  
    });
  
  }

  editarProducto(producto:TcProducto){
    this.producto=producto;
    this.titulo="Registro de Productos"
    this.productDialog=true;

  }

  hideDialog(){
    this.productDialog=false;

  }

  saveProduct(producto:TcProducto){


    if (producto.nId) {
      this.productosService.guardaProducto(producto).subscribe(productoActualizado => {
          this.listaProducto[0].nPrecioPeso = productoActualizado.nPrecioPeso;
          this.messageService.add({ severity: 'success', summary: 'Producto Actualizado', detail: 'Producto actualizado correctamente', life: 3000 });
      });
  }
  else {
      this.productosService.guardaProducto(producto).subscribe(productoNuevo => {
          this.listaProducto.push(productoNuevo);
          this.messageService.add({ severity: 'success', summary: 'Registro Correcto', detail: 'Producto registrado correctamente', life: 3000 });
      });
  }
  this.productDialog = false;

  }

 

  
  

}

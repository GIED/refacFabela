import { TcProducto } from './../../../productos/model/TcProducto';

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { CountryService } from '../../../demo/service/countryservice';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Clientes } from 'src/app/administracion/interfaces/clientes';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { ProductoService } from '../../../shared/service/producto.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { TvStockProducto } from '../../../productos/model/TvStockProducto';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  formGrp: FormGroup;

  clienteSeleccionado:Clientes;
  cliente:string;
  productoSeleccionado:TcProducto;
  producto:string;
  debuncerCliente: Subject<string> = new Subject();
  debuncerProducto: Subject<string> = new Subject();

  listaCliente: Clientes[]=[];
  listaProductoSugerencia: TcProducto[]=[];
  listaProductos: TvStockProducto[];
  productosFiltrados: TvStockProducto[]=[];
  

  mostrarSugerenciasCliente:boolean=false;
  mostrarDetalleCliente:boolean=false;
  mostrarSugerenciasProducto:boolean=false;

  saldoGeneralCliente:SaldoGeneralCliente;
  productDialog: boolean;
  total: number = 0;

  constructor(private clienteService:ClienteService,private productoService:ProductoService, private messageService: MessageService,
    private confirmationService: ConfirmationService) { 
      this.saldoGeneralCliente = new SaldoGeneralCliente();
      this.listaProductos=[];
    }

  ngOnInit(): void {
    this.buscaCliente();
    this.buscaProducto();
    this._initFormGroup();
  }

  _initFormGroup(): void{ 
    this.formGrp=new FormGroup({
      clienteCtrl: new FormControl('',[Validators.required,Validators.minLength(3)]),
      productoCtrl: new FormControl('',[]),
      clienteSeleccionadoCtrl: new FormControl('', []),
      productoSelecionadoCtrl: new FormControl('', []),
      nCantidadCtrl: new FormControl('', [ ])
    });
    
  }

  get clienteCtrl(){
    return this.formGrp.get('clienteCtrl') as FormControl;
  }

  get productoCtrl(){
    return this.formGrp.get('productoCtrl') as FormControl;
  }

  get clienteSeleccionadoCtrl(){
    return this.formGrp.get('clienteSeleccionadoCtrl') as FormControl;
  }
  get productoSelecionadoCtrl(){
    return this.formGrp.get('productoSelecionadoCtrl') as FormControl;
  }
  get nCantidadCtrl(){
    return this.formGrp.get('nCantidadCtrl') as FormControl;
  }

  inputCliente(){ 
    this.mostrarDetalleCliente=false;

    if (this.clienteCtrl.valid) {
  
      this.debuncerCliente.next(this.formGrp.get('clienteCtrl').value);
    }else{
      this.mostrarSugerenciasCliente=false;
    }  
  }

  buscaCliente(){
    this.debuncerCliente
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.clienteService.obtenerClientesLike(valor).subscribe(cliente => {
          //console.log(cliente.length);
          if (cliente.length != 0) {
            this.listaCliente=cliente;
            this.mostrarSugerenciasCliente=true;
            this.messageService.add({severity: 'info', summary: 'coincidencias', detail: 'clientes encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasCliente=false;
            this.messageService.add({severity: 'warn', summary: 'no encontrado', detail: 'cliente no encontrado, Verifique la información.', life: 3000});
          }      
        })
      });
}

valorSeleccionadoCliente(){
  console.log(this.formGrp.get('clienteSeleccionadoCtrl').value);
  this.clienteSeleccionado=this.formGrp.get('clienteSeleccionadoCtrl').value;
  this.clienteCtrl.setValue(this.clienteSeleccionado.sRazonSocial);
  this.clienteService.obtenerSaldoGeneralCliente(this.clienteSeleccionado.nId).subscribe(saldoCliente=>{
    
    this.mostrarSugerenciasCliente=false;

    if (saldoCliente != null) {
      this.saldoGeneralCliente=saldoCliente;
    }else{
      this.saldoGeneralCliente.nIdCliente=this.clienteSeleccionado.nId;
      this.saldoGeneralCliente.nCreditoDisponible=0;
      this.saldoGeneralCliente.nLimiteCredito=this.clienteSeleccionado.n_limiteCredito;
      this.saldoGeneralCliente.nSaldoTotal=0;
      this.saldoGeneralCliente.tcCliente=this.clienteSeleccionado;
    }
    this.mostrarDetalleCliente=true;
  });
  
}

inputProducto(){
  this.productosFiltrados=[];
    if (this.productoCtrl.valid) {
      this.debuncerProducto.next(this.formGrp.get('productoCtrl').value);
    }else{
      this.mostrarSugerenciasProducto=false;
    }  
}

buscaProducto(){
  
    this.debuncerProducto
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.productoService.obtenerProductosLike(valor).subscribe(productos => {
          console.log(productos.length);
          if (productos.length != 0) {
            this.listaProductoSugerencia=productos;
            this.mostrarSugerenciasProducto=true;
            this.messageService.add({severity: 'info', summary: 'coincidencias', detail: 'productos encontrados', life: 3000});
          }else{
            this.mostrarSugerenciasProducto=false;
            this.messageService.add({severity: 'warn', summary: 'no encontrado', detail: 'producto no encontrado, Verifique la información.', life: 3000});
          }        
        });
      });
}

valorSeleccionadoProducto(){
  this.productoSeleccionado=this.formGrp.get('productoSelecionadoCtrl').value;
  this.productoService.obtenerProductoIdBodegas(this.productoSeleccionado.nId).subscribe(productoStock =>{
    this.productosFiltrados.push(productoStock);
    this.mostrarSugerenciasProducto=false;
  });
}





openNew() { 
    this.productDialog = true;
}
 hideDialog() {
  this.productDialog = false;
  
}


agregarProduct(producto: TvStockProducto) {

  console.log(this.formGrp.get('nCantidadCtrl').value)
  producto.ncantidad=this.formGrp.get('nCantidadCtrl').value;
  console.log(producto);
  //verifica que se agrege una cantidad
  if (producto.ncantidad === 0 || producto.ncantidad === undefined || producto.ncantidad === null) {
    //console.log("entro a if");
    
    this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});

  }else{ 

   // if (this.products[this.findIndexById(producto.id, this.products)].quantity < producto.cantidad) {

      //this.messageService.add({severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la venta', life: 3000});
      //producto.cantidad=0;
      //this.products[this.findIndexById(producto.id, this.products)]=producto;
    //}else{ 

  // si la lista ya tiene datos entra a if para validar que el producto no se repita 
  if (this.listaProductos.length> 0) {
    // si el indice retornado es -1 el producto no existe en la lista y se agrega
    if (this.findIndexById(producto.nIdProducto, this.listaProductos) === -1 ) {

      
      producto.tcProducto.cantidadVenta=producto.ncantidad;
      this.listaProductos.push(producto);

      
    }
    //si entra a else el producto ya existe en la lista y solo actualiza la cantidad
    else{
      
      producto.tcProducto.cantidadVenta=this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)].tcProducto.cantidadVenta +producto.ncantidad;
      this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
    }
  }
  //si entra a else el producto no existe en la lista
  else{
    producto.tcProducto.cantidadVenta=producto.ncantidad;
    this.listaProductos.push(producto);
  }
  //obtiene el total de cuenta, resta cantidad del stock general y regresa input a 0
  console.log("total a: "+this.total);
  this.total += producto.tcProducto.nPrecioConIva*producto.ncantidad;
  producto.nCantidadTotal=producto.nCantidadTotal-producto.ncantidad;
  producto.ncantidad=0;
  console.log("total d: "+this.total);
  
  this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
  this.productosFiltrados=[];
  this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Producto Agregado Correctamente', life: 3000});

//}
}

}

quitarProducto(producto: TvStockProducto){
  console.log(producto);
  
  producto.ncantidad= producto.ncantidad + producto.tcProducto.cantidadVenta;
  this.total = this.total - producto.tcProducto.nPrecioConIva*producto.tcProducto.cantidadVenta;
  console.log("total: ",this.total);
  this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
  this.listaProductos.splice(this.findIndexById(producto.nIdProducto, this.listaProductos),1);
}

guardarCotizacion(tvStockProducto:TvStockProducto[]){
  console.log(tvStockProducto);
}

findIndexById(id: number, arreglo:TvStockProducto[]): number {
  let index = -1;
  for (let i = 0; i < arreglo.length; i++) {
      if (arreglo[i].nIdProducto === id) {
          index = i;
          break;
      }
  }
  return index;
}

}

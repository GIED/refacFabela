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


@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  clienteSeleccionado:Clientes;
  cliente:string;
  nIdProducto:number;
  producto:string;
  debuncerCliente: Subject<string> = new Subject();
  debuncerProducto: Subject<string> = new Subject();

  listaCliente: Clientes[]=[];
  listaProductoSugerencia: TcProducto[]=[];

  mostrarSugerenciasCliente:boolean=false;
  mostrarDetalleCliente:boolean=false;
  mostrarSugerenciasProducto:boolean=false;


  saldoGeneralCliente:SaldoGeneralCliente;


  cities: SelectItem[];
  paymentOptions: any[];
  productDialog: boolean;

  products: Product[]=[];
  //productsFiltrado: Product[]=[];

  listaProductos: TvStockProducto[]=[];

  product: Product;
  

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];

  total: number = 0;

  
  selectedCountryAdvanced: any[];
  countries: any[];
  filteredCountries: any[];

  productosFiltrados: TvStockProducto[]=[];
  productoSeleccionado: Product [] ;

  constructor(private clienteService:ClienteService,private productoService:ProductoService, private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private countryService: CountryService) { 
      this.saldoGeneralCliente = new SaldoGeneralCliente();
    }

  ngOnInit(): void {
    this.buscaCliente();
    this.buscaProducto();


    this.productService.getProducts().then(data => this.products = data);
    this.cities = [
      {label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}},
      {label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}},
      {label: 'London', value: {id: 3, name: 'London', code: 'LDN'}},
      {label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}},
      {label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}}
  ];
  this.countryService.getCountries().then(countries => {
    this.countries = countries;
});
  }

  inputCliente(){ 
    this.mostrarDetalleCliente=false;
    if (this.cliente.length >=3) {
  
      this.debuncerCliente.next(this.cliente);
    }else{
      this.mostrarSugerenciasCliente=false;
    }  
  }

  buscaCliente(){
    this.debuncerCliente
      .pipe(debounceTime(500))
      .subscribe(valor => { 
        this.clienteService.obtenerClientesLike(valor).subscribe(cliente => {
          console.log(cliente.length);
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
  console.log(this.clienteSeleccionado);
  this.cliente=this.clienteSeleccionado.sRazonSocial;
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
    if (this.producto.length >=3) {
      this.debuncerProducto.next(this.producto);
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
  this.productoService.obtenerProductoIdBodegas(this.nIdProducto).subscribe(productoStock =>{
    this.productosFiltrados.push(productoStock);
  });
}





openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
}
 hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}
editProduct(product: Product) {
  this.product = {...product};
  this.productDialog = true;
}

agregarProduct(producto: TvStockProducto) {
  console.log(producto);

  if (producto.ncantidad === 0 || producto.ncantidad === undefined || producto.ncantidad === null) {
    //console.log("entro a if");
    
    this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});

  }else{ 

   // if (this.products[this.findIndexById(producto.id, this.products)].quantity < producto.cantidad) {

      //this.messageService.add({severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la venta', life: 3000});
      //producto.cantidad=0;
      //this.products[this.findIndexById(producto.id, this.products)]=producto;
    //}else{ 


  if (this.listaProductos.length> 0) {
    if (this.findIndexById(producto.nIdProducto, this.listaProductos) === -1 ) {

      //console.log("entro a else");
      producto.tcProducto.cantidadVenta=producto.tcProducto.cantidad;
      this.listaProductos.push(producto);

      
    }else{
      
      producto.tcProducto.cantidadVenta=this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)].tcProducto.cantidad +producto.tcProducto.cantidad;
      this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
    }
  }else{
    producto.tcProducto.cantidadVenta=producto.tcProducto.cantidad;
    this.listaProductos.push(producto);
  }
  this.total += producto.tcProducto.nPrecioSinIva*producto.tcProducto.cantidad
  producto.ncantidad=producto.ncantidad-producto.ncantidad;
  producto.ncantidad=0;
  
  this.listaProductos[this.findIndexById(producto.nIdProducto, this.listaProductos)]=producto;
 // this.productsFiltrado=[];
  this.productoSeleccionado=[];
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


onSelect(event: any){
  //console.log( event );

  //this.productsFiltrado.push(event)

}

filterCountry(event) {
  const filtered: any[] = [];
  const query = event.query;
  for (let i = 0; i < this.countries.length; i++) {
      const country = this.countries[i];
      if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(country);
      }
  }

  this.filteredCountries = filtered;
}

/*filtrarProducto(event) {
  const filtered: TvStockProducto[] = [];
  const query = event.query;
  for (let i = 0; i < this.products.length; i++) {
      const producto = this.products[i];
      if (producto.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(producto);
      }
  }

  this.productosFiltrados = filtered;
}*/

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

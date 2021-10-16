import { Component, OnInit } from '@angular/core';
import { SelectItem, MessageService, ConfirmationService } from 'primeng/api';
import { CountryService } from 'src/app/demo/service/countryservice';
import { ProductService } from 'src/app/demo/service/productservice';
import { Product } from '../../../demo/domain/product';

@Component({
  selector: 'app-ventas-por-pedido',
  templateUrl: './ventas-por-pedido.component.html',
  styleUrls: ['./ventas-por-pedido.component.scss']
})
export class VentasPorPedidoComponent implements OnInit {

  titulo:string;
  cities: SelectItem[];
  paymentOptions: any[];
  productDialog: boolean;

  products: Product[]=[];
  productsFiltrado: Product[]=[];

  listaProductos: Product[]=[];

  product: Product;
  

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];

  total: number = 0;

  
  selectedCountryAdvanced: any[];
  countries: any[];
  filteredCountries: any[];

  productosFiltrados: Product[];
  productoSeleccionado: Product [] ;

  constructor(private productService: ProductService, private messageService: MessageService,
    private confirmationService: ConfirmationService, private countryService: CountryService) { 



    }

  ngOnInit(): void {
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
  openNew() {
    this.product = {};
    this.submitted = false;
    this.productDialog = true;
} 

hideDialog(valor: boolean) {
  this.productDialog = valor;
  this.submitted = valor;
}

saveProduct(product: Product) {

  console.log(product);

  this.product= product;
 

  if (this.product.name.trim()) {
      if (this.product.id) {
          this.products[this.findIndexById(this.product.id, this.products)] = this.product;
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto actualizado', life: 3000});
      }
      else {
          this.product.id = this.createId();
          this.product.image = 'product-placeholder.svg';
          this.products.push(this.product);
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Guardado', life: 3000});
      }

      this.products = [...this.products];
      this.productDialog = false;
      this.product = {};
  }
}

editProduct(product: Product) {
  this.product = {...product};
  this.productDialog = true;
}

agregarProduct(producto: Product) {
  //console.log(producto);

  if (producto.cantidad === 0 || producto.cantidad === undefined || producto.cantidad === null) {
    //console.log("entro a if");
    
    this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});

  }else{ 

   // if (this.products[this.findIndexById(producto.id, this.products)].quantity < producto.cantidad) {

      //this.messageService.add({severity: 'error', summary: 'Atención', detail: 'Stock insuficiente para realizar la venta', life: 3000});
      //producto.cantidad=0;
      //this.products[this.findIndexById(producto.id, this.products)]=producto;
    //}else{ 


  if (this.listaProductos.length> 0) {
    if (this.findIndexById(producto.id, this.listaProductos) === -1 ) {

      //console.log("entro a else");
      producto.cantidadVenta=producto.cantidad;
      this.listaProductos.push(producto);

      
    }else{
      
      producto.cantidadVenta=this.listaProductos[this.findIndexById(producto.id, this.listaProductos)].cantidadVenta +producto.cantidad;
      this.listaProductos[this.findIndexById(producto.id, this.listaProductos)]=producto;
    }
  }else{
    producto.cantidadVenta=producto.cantidad;
    this.listaProductos.push(producto);
  }
  this.total += producto.price*producto.cantidad
  producto.quantity=producto.quantity-producto.cantidad;
  producto.cantidad=0;
  
  this.products[this.findIndexById(producto.id, this.products)]=producto;
  this.productsFiltrado=[];
  this.productoSeleccionado=[];
  this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Producto Agregado Correctamente', life: 3000});

//}
}

}

quitarProducto(producto: Product){
  console.log(producto);
  
  producto.quantity= producto.quantity + producto.cantidadVenta;
  this.total = this.total - producto.price*producto.cantidadVenta;
  console.log("total: ",this.total);
  this.products[this.findIndexById(producto.id, this.products)]=producto;
  this.listaProductos.splice(this.findIndexById(producto.id, this.listaProductos),1);
}


onSelect(event: any){
  //console.log( event );
  this.productsFiltrado= [];
  this.productsFiltrado.push(event)

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

filtrarProducto(event) {

  const filtered: Product[] = [];
  const query = event.query;
  for (let i = 0; i < this.products.length; i++) {
      const producto = this.products[i];
      if (producto.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(producto);
      }
  }

  this.productosFiltrados = filtered;
}

findIndexById(id: string, arreglo:Product[]): number {
  let index = -1;
  for (let i = 0; i < arreglo.length; i++) {
      if (arreglo[i].id === id) {
          index = i;
          break;
      }
  }
  return index;
}

createId(): string {
  let id = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 5; i++ ) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}


}

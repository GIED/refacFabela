import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { CountryService } from '../../demo/service/countryservice';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {
  cities: SelectItem[];
  paymentOptions: any[];
  productDialog: boolean;

  products: Product[]=[];

  listaProductos: Product[]=[];

  product: Product;
  

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];

  selectedList: SelectItem;
  selectedCountryAdvanced: any[];
  countries: any[];
  filteredCountries: any[];

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
} hideDialog() {
  this.productDialog = false;
  this.submitted = false;
}
editProduct(product: Product) {
  this.product = {...product};
  this.productDialog = true;
}

agregarProduct(producto: Product) {
  console.log(producto);


  if (this.listaProductos[this.findIndexById(producto.id)] != -1) {
    this.listaProductos[this.findIndexById(producto.id)] = producto;
  }else{
    this.listaProductos.push(producto);
  }


  
 
  producto.quantity= producto.quantity-producto.cantidad;
 
 

  this.product[this.findIndexById(producto.id)] = producto;
  

  
  
  console.log(this.listaProductos)
  
  

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

findIndexById(id: string): number {
  let index = -1;
  for (let i = 0; i < this.products.length; i++) {
      if (this.products[i].id === id) {
          index = i;
          break;
      }
  }

  return index;
}

}


import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { BodegasService } from 'src/app/shared/service/bodegas.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['../../tabledemo.scss']
  
})
export class InventarioComponent implements OnInit {

  countries: any[];

    filteredCountries: any[];

    selectedCountryAdvanced: any[];

    valSlider = 50;

    valColor = '#424242';

    valRadio: string;

    valCheck: string[] = [];

    valSwitch: boolean;

    cities: SelectItem[];

    selectedList: SelectItem;

    selectedDrop: SelectItem;

    selectedMulti: string[] = [];

    valToggle = false;

    paymentOptions: any[];

    valSelect1: string;

    valSelect2: string;

    valueKnob = 20;
    lista:string[]=["hola","que","tal", "estas"];
    productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];


    constructor(private BodegasService: BodegasService, private productService: ProductService, private messageService: MessageService,
        private confirmationService: ConfirmationService) {
        
    }

    ngOnInit() {


        this.BodegasService.getCountries().then(countries => {
            this.countries = countries;
     this.productService.getProducts().then(data => this.products = data);

      this.cols = [
          { field: 'rfc', header: 'rfc' },
          { field: 'razon_social', header: 'razon_social' },
          { field: 'direccion', header: 'direccion' },
          { field: 'telefono', header: 'telefono' },
          { field: 'correo', header: 'correo' }
      ];


            
        });

     

        this.cities = [
            {label: 'New York', value: {id: 1, name: 'New York', code: 'NY'}},
            {label: 'Rome', value: {id: 2, name: 'Rome', code: 'RM'}},
            {label: 'London', value: {id: 3, name: 'London', code: 'LDN'}},
            {label: 'Istanbul', value: {id: 4, name: 'Istanbul', code: 'IST'}},
            {label: 'Paris', value: {id: 5, name: 'Paris', code: 'PRS'}}
        ];

        this.paymentOptions = [
            {name: 'Option 1', value: 1},
            {name: 'Option 2', value: 2},
            {name: 'Option 3', value: 3}
        ];



        this.productService.getProducts().then(data => this.products = data);

        this.cols = [
            { field: 'rfc', header: 'rfc' },
            { field: 'razon_social', header: 'razon_social' },
            { field: 'direccion', header: 'direccion' },
            { field: 'telefono', header: 'telefono' },
            { field: 'correo', header: 'correo' }
        ];
    }
  
    
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }
  
    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Deseas borrar los clientes seleccionandos?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.selectedProducts = null;
                this.messageService.add({severity: 'success', summary: 'Operación confirmda', detail: 'Clientes borrados', life: 3000});
            }
        });
    }
  
    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }
  
    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Realmente quieres borrar el cliente ' + product.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => val.id !== product.id);
                this.product = {};
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente eliminado', life: 3000});
            }
        });
    }
  
    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }
  
    saveProduct() {
        this.submitted = true;
  
        if (this.product.name.trim()) {
            if (this.product.id) {
                this.products[this.findIndexById(this.product.id)] = this.product;
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 10000});
            }
            else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente guardado', life: 10000});
            }
  
            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
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
  
    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for ( let i = 0; i < 5; i++ ) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
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


    }

   
    



import { Component, OnInit } from '@angular/core';
import { Product } from '../../../demo/domain/product';
import { ProductService } from '../../../demo/service/productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['../../../tabledemo.scss'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }

  @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
          text-align: center;
      }

      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
      }
  }

`],
})
export class UsuarioComponent implements OnInit {

  


    productDialog: boolean;
  
    products: Product[];
  
    product: Product;
  
    selectedProducts: Product[];
  
    submitted: boolean;
  
    cols: any[];
    states:any[];
  
    constructor(private productService: ProductService, private messageService: MessageService,
                private confirmationService: ConfirmationService) {
       
    }
  
    ngOnInit() {
        this.productService.getProducts().then(data => this.products = data);
  
        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'price', header: 'Price' },
            { field: 'category', header: 'Category' },
            { field: 'rating', header: 'Reviews' },
            { field: 'inventoryStatus', header: 'Status' }
        ];
        this.states = [
            {name: 'Administrador', code: '1'},
            {name: 'Ventas', value: '2'},
            {name: 'Almacen', code: '3'},
            {name: 'Ventas Mayoristas', code: '4'},
            {name: 'Entrega de Mercancia', code: '5'},
            {name: 'Cobranza', code: '6'}
        ];
    }
  
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
       
    }
  
    deleteSelectedProducts() {
        this.confirmationService.confirm({
            message: 'Deseas borrar los usuarios seleccionandos?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => !this.selectedProducts.includes(val));
                this.selectedProducts = null;
                this.messageService.add({severity: 'success', summary: 'Operación confirmda', detail: 'usuarios borrados', life: 3000});
            }
        });
    }
  
    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
    }
  
    deleteProduct(product: Product) {
        this.confirmationService.confirm({
            message: 'Realmente quieres borrar el usuario ' + product.name + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.products = this.products.filter(val => val.id !== product.id);
                this.product = {};
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'usuario eliminado', life: 3000});
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
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'usuario actualizado', life: 10000});
            }
            else {
                this.product.id = this.createId();
                this.product.image = 'product-placeholder.svg';
                this.products.push(this.product);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'usuario guardado', life: 10000});
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
  
    
  
    
  }


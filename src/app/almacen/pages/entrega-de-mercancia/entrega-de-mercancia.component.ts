import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';

@Component({
  selector: 'app-entrega-de-mercancia',
  templateUrl: './entrega-de-mercancia.component.html',
  styleUrls: ['./entrega-de-mercancia.component.scss']
})
export class EntregaDeMercanciaComponent implements OnInit {

  productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];
  detalleDialog: boolean;
  lineOptions:any;
  lineData: any;
  alternativosDialog: boolean;
  titulo:string;
  formaPago:any;
  usoCfdi:any;

constructor(private productService: ProductService, private messageService: MessageService,
  private confirmationService: ConfirmationService) { }

ngOnInit(){
  this.productService.getProducts().then(data => this.products = data);
  this.formaPago = [
      {label: 'Efectivo'},
      {label: 'Tarjeta de Crédito'},
      {label: 'Tarjeta de Débito'},
      {label: 'Transferencia'},
      {label: 'Cheque'},
      {label: 'Depósito'},

  ];
  this.usoCfdi = [
      {label: 'Gastos en general'},
      {label: 'Adquisisción de Mercancias'},
     

  ];
}
openNew() {
  this.product = {};
  this.submitted = false;
  this.productDialog = true;
  this.titulo="Registro de Productos"
}

deleteSelectedProducts() {
  this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.products = this.products.filter(val => !this.selectedProducts.includes(val));
          this.selectedProducts = null;
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
      }
  });
}


editProduct(product: Product) {
  this.product = {...product};
  this.productDialog = true;
  this.titulo="Actualización de Producto"
}
alternativosProduct(product: Product) {
  this.product = {...product};
  this.alternativosDialog = true;
 
}
registroAlternativos(){
  this.product = {};
  this.submitted = false;
  this.productDialog = true;
  this.titulo="Registro de Productos Alternativos"
}
detalleProduct(product: Product) {
  this.product = {...product};
  this.detalleDialog = true;
  this.lineData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
          {
              label: 'First Dataset',
              data: [65, 59, 80, 81, 56, 55, 40],
              fill: false,
              backgroundColor: 'rgb(255, 205, 86)',
              borderColor: 'rgb(255, 205, 86)',
              tension: .4
          },
          {
              label: 'Second Dataset',
              data: [28, 48, 40, 19, 86, 27, 90],
              fill: false,
              backgroundColor: 'rgb(75, 192, 192)',
              borderColor: 'rgb(75, 192, 192)',
              tension: .4
          }
      ]
  };

  this.lineOptions = {
      plugins: {
          legend: {
              labels: {
                  fontColor: '#A0A7B5'
              }
          }
      },
      scales: {
          x: {
              ticks: {
                  color: '#A0A7B5'
              },
              grid: {
                  color:  'rgba(160, 167, 181, .3)',
              }
          },
          y: {
              ticks: {
                  color: '#A0A7B5'
              },
              grid: {
                  color:  'rgba(160, 167, 181, .3)',
              }
          },
      }
  };
}

deleteProduct(product: Product) {
  this.confirmationService.confirm({
      message: 'Desea borrar el producto ' + product.name + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.products = this.products.filter(val => val.id !== product.id);
          this.product = {};
          this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Borrado', life: 3000});
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



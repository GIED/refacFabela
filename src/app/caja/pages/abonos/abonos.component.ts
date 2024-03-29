import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';

@Component({
  selector: 'app-abonos',
  templateUrl: './abonos.component.html',
  styleUrls: ['./abonos.component.scss']
})
export class AbonosComponent implements OnInit {
  productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];
 
  pieData: any;

  polarData: any;

  radarData: any;

  lineOptions: any;

  barOptions: any;

  pieOptions: any;

  polarOptions: any;

  radarOptions: any;
  
  cars:any;

  car:any

  constructor(private productService: ProductService, private messageService: MessageService,
              private confirmationService: ConfirmationService) {
     
  }

  ngOnInit() {
      this.productService.getProducts().then(data => this.products = data);

      this.cols = [
          { field: 'rfc', header: 'rfc' },
          { field: 'razon_social', header: 'razon_social' },
          { field: 'direccion', header: 'direccion' },
          { field: 'telefono', header: 'telefono' },
          { field: 'correo', header: 'correo' }
      ];

      this.pieData = {
        labels: ['Abonos', 'Saldos'],
        datasets: [
            {
                data: [50000, 180000,],
                backgroundColor: [
                    'rgb(54, 162, 235)',
                    'rgb(255, 99, 132)',
                   
                ]
            }]
    };

   
    this.car = [
        { total: '145,000'
     },
     { abono: '105,000'
    },
    { saldo: '40,000'
},
       
    ];

    this.pieOptions = {
        plugins: {
            legend: {
                labels: {
                    fontColor: '#A0A7B5'
                }
            }
        }
    };
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
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Clientes borrados', life: 3000});
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
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente eliminado', life: 3000});
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
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000});
          }
          else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente guardado', life: 10000});
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

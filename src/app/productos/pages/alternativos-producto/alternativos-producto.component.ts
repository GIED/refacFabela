import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';

@Component({
  selector: 'app-alternativos-producto',
  templateUrl: './alternativos-producto.component.html',
  styleUrls: ['./alternativos-producto.component.scss']
})
export class AlternativosProductoComponent implements OnInit {

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


    constructor(private productService: ProductService, private messageService: MessageService,
        private confirmationService: ConfirmationService) {

}

ngOnInit() {
    this.productService.getProductsWithOrdersSmall().then(data => this.products = data);
   
    
}

  
openNew(product:Product) {
    this.product = {...product};
    this.submitted = false;
    this.productDialog = true;
    this.titulo="Registro de Productos Alternativos"
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

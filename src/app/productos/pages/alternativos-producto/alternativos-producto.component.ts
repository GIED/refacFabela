import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { TcProducto } from '../../model/TcProducto';

@Component({
  selector: 'app-alternativos-producto',
  templateUrl: './alternativos-producto.component.html',
  styleUrls: ['./alternativos-producto.component.scss']
})
export class AlternativosProductoComponent implements OnInit {

    productDialog: boolean;
    titulo:string;
    listaProductos:TcProducto[];


    constructor(private productService: ProductService, private messageService: MessageService,
        private confirmationService: ConfirmationService) {

}

ngOnInit() {
    //this.productService.getProductsWithOrdersSmall().then(data => this.products = data);
   
    
}

openNew() {
    this.productDialog = true;
    this.titulo="Registro de Productos Alternativos";
}

hideDialog(valor: boolean) {
    this.productDialog = valor;
}

saveProduct(producto: TcProducto) {
/*
    console.log(producto);

        if (producto.nId) {
            this.productosService.guardaProducto(producto).subscribe(productoActualizado => {
                this.listaProductos[this.findIndexById(productoActualizado.nId)] = productoActualizado;
                this.messageService.add({severity: 'success', summary: 'Producto Actualizado', detail: 'Producto actualizado correctamente', life: 3000});
            });
        }
        else {
            
            this.productosService.guardaProducto(producto).subscribe(productoNuevo =>{
                this.listaProductos.push(productoNuevo);
                this.messageService.add({severity: 'success', summary: 'Registro Correcto', detail: 'Producto registrado correctamente', life: 3000});
            });
        }
        this.listaProductos = [...this.listaProductos];
        
    */
}




findIndexById(id: string): number {
    let index = -1;
    /*for (let i = 0; i < this.products.length; i++) {
        if (this.products[i].id === id) {
            index = i;
            break;
        }
    }*/

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

import { TcProducto } from './../../model/TcProducto';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { ProductoService } from '../../../shared/service/producto.service';
import { producto } from '../../interfaces/producto.interfaces';
import { NgxSpinnerService } from 'ngx-spinner';




@Component({
  selector: 'app-registro-producto',
  templateUrl:'./registro-producto.component.html',
  styleUrls: ['./registro-producto.component.scss']
})
export class RegistroProductoComponent implements OnInit {

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

    listaProductos: TcProducto[];
    producto:TcProducto;


    constructor( 
                private productosService: ProductoService, 
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private spinner: NgxSpinnerService) {

}

ngOnInit() {
    this.spinner.show();
    this.obtenerProductos();
    this.spinner.hide();    
}

obtenerProductos(){ 
    this.productosService.obtenerProductos().subscribe(productos => {
        this.listaProductos=productos;
       
    });
    

}

  
openNew() {
    this.productDialog = true;
    this.titulo="Registro de Productos"
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



hideDialog(valor: boolean) {
    this.productDialog = valor;
}

saveProduct(producto: TcProducto) {

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
        this.productDialog = false;
        this.listaProductos = [...this.listaProductos];
        
    
}

deleteProduct(product: TcProducto) {
    this.confirmationService.confirm({
        message: 'Desea borrar el producto ' + product.sProducto + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

            product.nEstatus=0;

            this.productosService.guardaProducto(product).subscribe(productoEliminado =>{
                this.listaProductos = this.listaProductos.filter(val => val.nId !== product.nId);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Borrado', life: 3000});
            })
        }
    });
}

findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.listaProductos.length; i++) {
        if (this.listaProductos[i].nId === id) {
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

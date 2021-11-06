import { TcProducto } from './../../model/TcProducto';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductoService } from '../../../shared/service/producto.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';
import { BodegasService } from '../../../shared/service/bodegas.service';
import { TwProductoBodega } from '../../model/TwProductoBodega';




@Component({
  selector: 'app-registro-producto',
  templateUrl:'./registro-producto.component.html',
  styleUrls: ['./registro-producto.component.scss']
})
export class RegistroProductoComponent implements OnInit {

    productDialog: boolean;
    detalleDialog: boolean;
    alternativosDialog: boolean;



    cols: any[];
    lineOptions:any;
    lineData: any;
    
    producto:TcProducto;
    listaProductos: TcProducto[];
    listaHistoriaPrecioProducto: TcHistoriaPrecioProducto[];
    listaProductoBodega:TwProductoBodega[];
    
    
    titulo:string;
    stockTotal:number=0;
    nIdProducto:number;
    sProducto:string;


    constructor( 
                private productosService: ProductoService, 
                private bodegasService:BodegasService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private spinner: NgxSpinnerService,) {
                this.obtenerProductos();
                this.productDialog=false;
}

ngOnInit() {

}

obtenerProductos(){ 
    console.log("entre a este metodo");
    this.spinner.show();
    this.productosService.obtenerProductos().subscribe(productos => {
        this.listaProductos=productos;
       this.spinner.hide();

       
    });
    

}

  
openNew() {
    this.productDialog = true;
    this.titulo="Registro de Productos"
}


alternativosProduct(nId:number , sProducto:string) {

    console.log(nId);
    console.log(sProducto);

    this.nIdProducto=nId;
    this.sProducto=sProducto;

    console.log(this.nIdProducto);
    console.log(this.sProducto);
   
    this.alternativosDialog = true;   
}

detalleProduct(nId:number) {

    this.detalleDialog = true;
    this.stockTotal=0;

    this.spinner.show();
    this.productosService.historiaPrecioProducto(nId).subscribe(productos => {
        this.listaHistoriaPrecioProducto=productos;
        this.spinner.hide();
       
    });

    this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega =>{
        this.listaProductoBodega=productoBodega;
        for (const key in productoBodega) {
            this.stockTotal += this.listaProductoBodega[key].nCantidad;
        }
        this.spinner.hide();
    });
  
/*this.product = {...product};
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
    };*/
}



hideDialog(valor: boolean) {
    this.productDialog = valor;
}
hideDialogAlternativos() {
    this.alternativosDialog = false;
}
hideDialogDetalle() {
    this.detalleDialog = false;
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

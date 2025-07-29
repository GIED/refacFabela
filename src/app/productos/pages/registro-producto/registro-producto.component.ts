import { TcProducto } from './../../model/TcProducto';
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { ProductoService } from '../../../shared/service/producto.service';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';
import { BodegasService } from '../../../shared/service/bodegas.service';
import { TwProductoBodega } from '../../model/TwProductoBodega';
import { DialogService } from 'primeng/dynamicdialog';
import { FormProductoComponent } from '../../components/form-producto/form-producto.component';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';




@Component({
    selector: 'app-registro-producto',
    templateUrl: './registro-producto.component.html',
    styleUrls: ['./registro-producto.component.scss']
})
export class RegistroProductoComponent implements OnInit {

    productDialog: boolean = false;
    detalleDialog: boolean = false;
    alternativosDialog: boolean = false;
    muestraConfirmDialog: boolean = false;
    selectedProducts: TcProducto[];
    cols: any[];
    lineOptions: any;
    lineData: any;
    producto: TcProducto;
    listaProductos: TcProducto[];
    listaHistoriaPrecioProducto: TcHistoriaPrecioProducto[];

    listaProductoBodega: TwProductoBodega[];
    titulo: string;
    stockTotal: number = 0;
    nIdProducto: number;
    sProducto: string;
    traspaso:boolean=false;
    sNoParte:string;

    constructor(
        private productosService: ProductoService,
        private bodegasService: BodegasService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
         public dialogService: DialogService
    ) {
        
    }


    ngOnInit() {

    }
    informacionProducto(nId:number) {
        this.listaProductos=null;
     this.productosService.obtenerProductoId(nId).subscribe(data=>{
        this.listaProductos=data;
      
      // console.log(data);


     })
     



    }


 formProducto(producto: TcProducto): void {
  const isNuevo = !producto || typeof producto.nId !== 'number' || producto.nId == null || producto.nId === 0;

  const modo = isNuevo ? ModeActionOnModel.CREATING : ModeActionOnModel.EDITING;
  console.log('Este el modo',modo);

  const ref = this.dialogService.open(FormProductoComponent, {
    data: new ModelContainer(modo, producto),
    header: isNuevo ? 'Nuevo Producto' : 'Editar Producto',
    width: '70%',
    height: 'auto',
    baseZIndex: 1000,
    closable: true,
    dismissableMask: true,
    modal: true
  });

   ref.onClose.subscribe((productoGuardado: TcProducto | undefined) => {
    if (productoGuardado) {
      // Aquí puedes actualizar tu lista, tabla, etc.
      console.log('Producto recibido desde el diálogo:', productoGuardado);
      // Ejemplo: recargar lista o actualizar tabla
      this.informacionProducto(productoGuardado.nId); // o lo que apliques
    } else {
      console.log('El usuario cerró el formulario sin guardar.');
    }
  });
}


    obtenerProductos() {
        this.productosService.obtenerProductos().subscribe(productos => {
            this.listaProductos = productos;
        },
            error => {
                this.messageService.add({ severity: 'error', summary: 'Error de conexión', detail: 'Error de conexión con el servidor', life: 3000 });
            });
    }


    openNew() {
        this.producto = null;
        this.productDialog = true;
        this.titulo = "Registro de Productos"
    }

    editarProducto(producto: TcProducto) {
        this.producto = producto;
        this.productDialog = true;
        this.titulo = "Actualiza de Producto"
    }


    alternativosProduct(nId: number, sProducto: string, sNoParte:string) {
        this.nIdProducto = nId;
        this.sProducto = sProducto;
        this.sNoParte=sNoParte;

        this.alternativosDialog = true;
    }

    detalleProduct(nId: number) {
        this.detalleDialog = true;
        this.stockTotal = 0;
        this.productosService.historiaPrecioProducto(nId).subscribe(productos => {
            this.listaHistoriaPrecioProducto = productos;
        });

        this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega => {
            this.listaProductoBodega = productoBodega;
            for (const key in productoBodega) {
                this.stockTotal += this.listaProductoBodega[key].nCantidad;
            }
        });
      
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

        if (producto.nId) {
            this.productosService.guardaProducto(producto).subscribe(productoActualizado => {
                this.listaProductos[this.findIndexById(productoActualizado.nId)] = productoActualizado;
                this.messageService.add({ severity: 'success', summary: 'Producto Actualizado', detail: 'Producto actualizado correctamente', life: 3000 });
            });
        }
        else {
            this.productosService.guardaProducto(producto).subscribe(productoNuevo => {
                this.listaProductos.push(productoNuevo);
                this.messageService.add({ severity: 'success', summary: 'Registro Correcto', detail: 'Producto registrado correctamente', life: 3000 });
            });
        }
        this.productDialog = false;
        this.listaProductos = [...this.listaProductos];
    }

    deleteProduct(product: TcProducto) {
        this.muestraConfirmDialog = true;
        this.confirmationService.confirm({
            message: 'Desea borrar el producto ' + product.sProducto + '?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                product.nEstatus = 0;
                this.productosService.guardaProducto(product).subscribe(productoEliminado => {
                    this.listaProductos = this.listaProductos.filter(val => val.nId !== product.nId);
                    this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Producto Borrado', life: 3000 });
                    this.muestraConfirmDialog = false;
                });
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'no se borro el producto' });
                        this.muestraConfirmDialog = false;
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'acción cancelada' });
                        this.muestraConfirmDialog = false;
                        break;
                }
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
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
}

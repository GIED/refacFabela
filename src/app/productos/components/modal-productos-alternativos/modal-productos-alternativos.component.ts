import { TwProductoAlternativo } from 'src/app/productos/model/TwProductoAlternativo';
import { Component, Input, OnInit } from "@angular/core";
import { ProductoService } from "src/app/shared/service/producto.service";
import { NgxSpinnerService } from "ngx-spinner";
import { TcProducto } from "../../model/TcProducto";
import { ConfirmationService, ConfirmEventType, MessageService } from "primeng/api";


@Component({
  selector: "app-modal-productos-alternativos",
  templateUrl: "./modal-productos-alternativos.component.html",
  styleUrls: ["./modal-productos-alternativos.component.scss"],
})
export class ModalProductosAlternativosComponent implements OnInit {
  @Input() nIdProducto: number;
  @Input() sProducto: string;

  

  listaProductoAlternativo: TwProductoAlternativo[] = [];

  productDialog: boolean = false;
  muestraConfirmDialogAlter:boolean=false;
  titulo: string;

  constructor(
    private productosService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {}

  ngOnInit(): void {
    this.obtenerProductosAlternativos();
  }

  obtenerProductosAlternativos() {
    
    this.productosService
      .obtenerProductosAlternativos(this.nIdProducto)
      .subscribe((productosAlter) => {
        this.listaProductoAlternativo = productosAlter;
        
      });
  }

  registroAlternativos() {
    // this.product = {};
    this.productDialog = true;
    this.titulo = "Registro de Productos Alternativos";
  }

  saveProduct(producto: TcProducto) {

  let twProductoAlternativo = new TwProductoAlternativo(null,1,null,this.nIdProducto,producto);
  console.log(twProductoAlternativo);

  this.productosService.guardaProductoAlternativo(twProductoAlternativo).subscribe(newProdAlt =>{
    this.obtenerProductosAlternativos();
  });
    
  }

  deleteProductA(product: TwProductoAlternativo) {

    this.muestraConfirmDialogAlter=true;

    this.confirmationService.confirm({
        message: 'Desea borrar el producto ' + product.tcProductoAlternativo.sProducto + '?',
        header: 'Confirmar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

            product.nEstatus=0;

            this.productosService.guardaProductoAlternativo(product).subscribe(productoEliminado =>{
                this.listaProductoAlternativo = this.listaProductoAlternativo.filter(val => val.nId !== productoEliminado.nId);
                this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Producto Borrado', life: 3000});
                this.muestraConfirmDialogAlter=false;
            })
        },reject: (type) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'error', summary:'Rejected', detail:'no se borro el producto'});
                  this.muestraConfirmDialogAlter=false;
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelled', detail:'acción cancelada'});
                  this.muestraConfirmDialogAlter=false;
              break;
          }
      }
    });
}

  hideDialog(valor: boolean) {
    this.productDialog = valor;
  }
}

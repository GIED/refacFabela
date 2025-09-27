import { Component, Input, OnInit } from '@angular/core';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TcProducto } from '../../model/TcProducto';
import { TwProductoAlternativo } from 'src/app/productos/model/TwProductoAlternativo';

@Component({
  selector: 'app-modal-productos-alternativos',
  templateUrl: './modal-productos-alternativos.component.html',
  styleUrls: ['./modal-productos-alternativos.component.scss'],
})
export class ModalProductosAlternativosComponent implements OnInit {
  @Input() nIdProducto!: number;
  @Input() sProducto!: string;
  @Input() sNoParte!: string;

  listaProductoAlternativo: TwProductoAlternativo[] = [];
  productDialog = false;
  muestraConfirmDialogAlter = false;
  titulo = '';
  tcProducto = new TcProducto();

  constructor(
    private productosService: ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.obtenerProductosAlternativos();
  }

  informacionProducto(nId: number): void {
    this.productosService.obtenerProductoBeanId(nId).subscribe((data) => {
      this.tcProducto = data;

      if (this.nIdProducto === this.tcProducto.nId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'El producto no puede ser alternativo de sí mismo',
          life: 3000,
        });
        return;
      }

      const nuevoAlternativo = new TwProductoAlternativo(
        null,
        1,
        this.tcProducto.nId,
        this.nIdProducto,
        this.tcProducto
      );

      this.productosService.guardaProductoAlternativo(nuevoAlternativo).subscribe(() => {
        this.obtenerProductosAlternativos();
        this.messageService.add({
          severity: 'success',
          summary: 'Correcto',
          detail: 'Se guardó el número alternativo',
          life: 3000,
        });
      });
    });
  }

  obtenerProductosAlternativos(): void {
    this.productosService
      .obtenerProductosAlternativos(this.nIdProducto)
      .subscribe((productos) => (this.listaProductoAlternativo = productos));
  }

  registroAlternativos(): void {
    this.productDialog = true;
    this.titulo = 'Registro de Productos Alternativos';
  }

  deleteProductA(product: TwProductoAlternativo): void {
    this.muestraConfirmDialogAlter = true;

    this.confirmationService.confirm({
      message: `¿Desea borrar el producto ${product.tcProductoAlternativo.sNoParte}, como alternativo del número de parte: ${this.sNoParte}?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        product.nEstatus = 0;

        this.productosService.guardaProductoAlternativo(product).subscribe(() => {
          this.listaProductoAlternativo = this.listaProductoAlternativo.filter(
            (val) => val.nId !== product.nId
          );
          this.messageService.add({
            severity: 'success',
            summary: 'Correcto',
            detail: 'Producto borrado',
            life: 3000,
          });
          this.muestraConfirmDialogAlter = false;
        });
      },
      reject: (type) => {
        const mensajes = {
          [ConfirmEventType.REJECT]: { severity: 'error', summary: 'Error', detail: 'No se borró el producto' },
          [ConfirmEventType.CANCEL]: { severity: 'warn', summary: 'Cancelado', detail: 'Acción cancelada' },
        };

        const mensaje = mensajes[type];
        if (mensaje) {
          this.messageService.add(mensaje);
        }
        this.muestraConfirmDialogAlter = false;
      },
    });
  }

  hideDialog(valor: boolean): void {
    this.productDialog = valor;
  }
}

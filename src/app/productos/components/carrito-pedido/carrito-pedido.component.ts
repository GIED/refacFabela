import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VwMetaProductoCompra } from '../../model/VwMetaProductoCompra';
import { TwCarritoCompraPedido } from '../../model/TwCarritoCompraPedido';
import { ComprasService } from '../../../shared/service/compras.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PedidosService } from 'src/app/shared/service/pedidos.service';
import { TwPedidoProducto } from '../../model/TwPedidoProducto';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-carrito-pedido',
  templateUrl: './carrito-pedido.component.html',
  styleUrls: ['./carrito-pedido.component.scss']
})
export class CarritoPedidoComponent implements OnInit {


  @Input() listaTwCarritoCompraPedido: TwCarritoCompraPedido[];
  @Output() cerrar: EventEmitter<Boolean> = new EventEmitter();
  cols: any[];



  constructor(private comprasService: ComprasService, private messageService: MessageService, private pedidoservice: PedidosService, private tokenService: TokenService
    , private confirmationService: ConfirmationService, private pedidosService: PedidosService
  ) {

    this.cols = [
      { field: 'tcProducto.sNoParte', header: 'No Parte' },
      { field: 'tcProducto.sProducto', header: 'Producto' },
      { field: 'tcProducto.sMarca', header: 'Marca' },
      { field: 'dFechaRegistro', header: 'Fecha Registro' },
      { field: 'nCantidad', header: 'Cantidad' },
      { field: 'tcProveedor.sRazonSocial', header: 'Proveedor' }
    ];

  }

  ngOnInit(): void {



  }

  addProduct() {

  }

  deleteProductoCarrito(twCarritoCompraPedido: TwCarritoCompraPedido) {

    console.log('Es lo que voy a borrar', twCarritoCompraPedido);

    this.pedidoservice.borrarPedidoCarritoId(twCarritoCompraPedido.nId).subscribe(data => {

      console.log(data);
      if (data) {
        this.messageService.add({ severity: 'success', summary: 'Registro borrado', detail: 'El producto fue descartado del pedido', life: 3000 });
        this.cerrar.emit(true);

      }
      else {
        this.messageService.add({ severity: 'success', summary: 'Registro no borrado', detail: 'El producto no puedo eliminarse de la lista', life: 3000 });

      }

    });





  }



  limpiarCarritoUsuario() {

    let usuario = this.tokenService.getIdUser();


    this.confirmationService.confirm({
      message: 'Estás seguro de que deseas vaciar tu carrito de compras?. Una vez confirmado, no podrás recuperar los productos eliminados.',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {

        this.pedidoservice.borrarProductosCarritoUsuario(usuario).subscribe(data2 => {

          if (data2) {
            this.messageService.add({ severity: 'success', summary: 'Registros borrados', detail: 'Los producto fueron eliminados del carrito ', life: 3000 });
            this.pedidosService.obtenerProductosComprasUsuario(usuario).subscribe(data3=>{
             
              this.listaTwCarritoCompraPedido=data3;

            })
            
            this.cerrar.emit(true);

          }
          else {
            this.messageService.add({ severity: 'success', summary: 'Registro no borrado', detail: 'El producto no puedo eliminarse de la lista', life: 3000 });

          }



        })


      },
      reject: () => {

      }

    })

















  }





}

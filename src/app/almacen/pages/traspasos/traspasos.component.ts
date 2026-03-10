import { Component, OnInit } from '@angular/core';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from '../../../shared/service/bodegas.service';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';
import { ModeActionOnModel } from '../../../shared/utils/model-action-on-model';
import { ModelContainer } from '../../../shared/utils/model-container';
import { ModalProductoBodegaExternoComponent } from '../../../productos/components/modal-producto-bodega-externo/modal-producto-bodega-externo.component';
import { TwProductoBodegaDto } from '../../../productos/model/TwProductoBodegaDto';
import { TraspasoExternoDto } from '../../../productos/model/TraspasoExternoDto';
import { TraspasoService } from '../../../shared/service/traspaso.service';
import { ModalProductosBodegaInternoComponent } from 'src/app/productos/components/modal-productos-bodega-interno/modal-productos-bodega-interno.component';
import { forkJoin } from 'rxjs';
import { AjusteInventarioComponent } from '../../components/ajuste-inventario/ajuste-inventario.component';
import { TokenService } from 'src/app/shared/service/token.service';

@Component({
  selector: 'app-traspasos',
  templateUrl: './traspasos.component.html',
  styleUrls: ['./traspasos.component.scss'],
  providers: [MessageService]
})
export class TraspasosComponent implements OnInit {

  listaProductoBodega: TwProductoBodega[];
  mostrar: boolean;
  cargando: boolean;
  stockTotal: number;
  IdUsuario: number;
  mostrarAjustes: boolean;
  private ultimoProductoId: number;
  
  
  constructor(
    private bodegasService: BodegasService,
    public dialogService: DialogService,
    private traspasoService: TraspasoService,
    private tokenService: TokenService,
    private messageService: MessageService
  ) {
    this.mostrar = false;
    this.cargando = false;
    this.stockTotal = 0;
  }

  ngOnInit(): void {

    this.IdUsuario=this.tokenService.getIdUser();

    if(this.IdUsuario==19 || this.IdUsuario==23 || this.IdUsuario==29 || this.IdUsuario==8 || this.IdUsuario==27 || this.IdUsuario==26){

      this.mostrarAjustes=true;

    }
    else{
      this.mostrarAjustes=false;
    }
   
  }

  
  obtenerBodegas(nId: number){
    this.cargando = true;
    this.mostrar = false;
    this.ultimoProductoId = nId;
    this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega => {
      this.listaProductoBodega = productoBodega;
      this.stockTotal = productoBodega.reduce((sum, b) => sum + (b.nCantidad || 0), 0);
      this.cargando = false;
      this.mostrar = true;
    }, () => {
      this.cargando = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo consultar la distribución del producto.',
        life: 5000
      });
    });
  }

  refrescar() {
    if (this.ultimoProductoId) {
      this.obtenerBodegas(this.ultimoProductoId);
    }
  }

  modalProductoBodega(dataBodega:TwProductoBodega) {
    const ref = this.dialogService.open(ModalProductosBodegaInternoComponent, {
       data: new ModelContainer(ModeActionOnModel.CREATING, dataBodega),
       header: 'Movimiento Interno de Mercancía',
       width: '65%',
       styleClass: 'modal-traspaso modal-traspaso--interno',
       contentStyle: { 'padding': '1.2rem 1.5rem', 'overflow': 'auto' },
       baseZIndex: 10000,
       closable: true,
       dismissableMask: true,
       modal: true
   })
   ref.onClose.subscribe((data:TwProductoBodega) =>{
     if (!data) return;
     this.obtenerBodegas(data.nIdProducto);
   })
  }

  modalProductoAjuste(dataBodega:TwProductoBodega) {
    const ref = this.dialogService.open(AjusteInventarioComponent, {
       data: new ModelContainer(ModeActionOnModel.CREATING, dataBodega),
       header: 'Ajuste de Inventario',
       width: '65%',
       styleClass: 'modal-traspaso modal-traspaso--ajuste',
       contentStyle: { 'padding': '1.2rem 1.5rem', 'overflow': 'auto' },
       baseZIndex: 10000,
       closable: true,
       dismissableMask: true,
       modal: true
   })
   ref.onClose.subscribe((data:TwProductoBodega) =>{
     if (!data) return;
     this.obtenerBodegas(data.nIdProducto);
   })
  }

  /**
   * Movimiento externo: traspaso entre bodegas.
   * CORRECCIÓN: Ya no se calcula la aritmética en el frontend.
   * Solo se envía un DTO con productoId, bodegaOrigen, bodegaDestino y cantidad.
   * El backend lee datos frescos con bloqueo y hace el cálculo atómicamente.
   */
  modalProductoBodegaExterno(dataBodega:TwProductoBodega) {
    const ref = this.dialogService.open(ModalProductoBodegaExternoComponent, {
       data: new ModelContainer(ModeActionOnModel.CREATING, dataBodega),
       header: 'Movimiento Externo de Mercancía',
       width: '65%',
       styleClass: 'modal-traspaso modal-traspaso--externo',
       contentStyle: { 'padding': '1.2rem 1.5rem', 'overflow': 'auto' },
       baseZIndex: 10000,
       closable: true,
       dismissableMask: true,
       modal: true
   })
   ref.onClose.subscribe((data:TwProductoBodegaDto) =>{
     if (!data) {
       return; // El usuario cerró el modal sin hacer nada
     }

     // Construir DTO ligero — la aritmética la hace el backend
     const dto = new TraspasoExternoDto();
     dto.nIdProducto = dataBodega.nIdProducto;
     dto.nIdBodegaOrigen = data.nIdBodegaActual;
     dto.nIdBodegaDestino = data.nIdBodegaDestino;
     dto.nCantidad = data.nCantidadDestino;

     this.traspasoService.guardarMovimientoExterno(dto).subscribe({
       next: () => {
         this.messageService.add({
           severity: 'success',
           summary: 'Traspaso exitoso',
           detail: 'El movimiento se registró correctamente.'
         });
         this.obtenerBodegas(dataBodega.nIdProducto);
       },
       error: (err) => {
         const mensaje = err?.error?.error
           || 'No se pudo completar el traspaso. Intente de nuevo.';
         this.messageService.add({
           severity: 'error',
           summary: 'Error en el traspaso',
           detail: mensaje,
           life: 8000
         });
       }
     });
   });
  }

}

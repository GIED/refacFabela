import { Component, OnInit } from '@angular/core';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from '../../../shared/service/bodegas.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ModalProductosBodegaComponent } from '../../../productos/components/modal-productos-bodega/modal-productos-bodega.component';
import { ModeActionOnModel } from '../../../shared/utils/model-action-on-model';
import { ModelContainer } from '../../../shared/utils/model-container';
import { findIndex } from 'rxjs/operators';
import { ModalProductoBodegaExternoComponent } from '../../../productos/components/modal-producto-bodega-externo/modal-producto-bodega-externo.component';

@Component({
  selector: 'app-traspasos',
  templateUrl: './traspasos.component.html',
  styleUrls: ['./traspasos.component.scss']
})
export class TraspasosComponent implements OnInit {

  listaProductoBodega: TwProductoBodega[];
  mostrar:boolean;
  
  
  constructor(private bodegasService: BodegasService, public dialogService: DialogService) {
    this.mostrar=false;
   }

  ngOnInit(): void {
   
  }

  
  obtenerBodegas(nId: number){
    this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega => {
      this.listaProductoBodega = productoBodega;
      this.mostrar=true;
  });
  }

  modalProductoBodega(dataBodega:TwProductoBodega) {
    const ref = this.dialogService.open(ModalProductosBodegaComponent, {
       data: new ModelContainer(ModeActionOnModel.CREATING, dataBodega),
       header: 'Movimiento Interno de mercancía',
       width: '70%'
   })
   ref.onClose.subscribe((data:TwProductoBodega) =>{
     console.log('data que se recibe al cerrar',data);
     this.obtenerBodegas(data.nIdProducto);
   })
  }

  modalProductoBodegaExterno(dataBodega:TwProductoBodega) {
    const ref = this.dialogService.open(ModalProductoBodegaExternoComponent, {
       data: new ModelContainer(ModeActionOnModel.CREATING, dataBodega),
       header: 'Movimiento Externo de Mercancía',
       width: '70%'
   })
   ref.onClose.subscribe((data:TwProductoBodega) =>{
     console.log('data que se recibe al cerrar',data);
     this.obtenerBodegas(data.nIdProducto);
   })
  }





}

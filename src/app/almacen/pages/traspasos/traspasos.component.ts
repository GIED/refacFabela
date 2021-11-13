import { Component, OnInit } from '@angular/core';
import { TwProductoBodega } from 'src/app/productos/model/TwProductoBodega';
import { BodegasService } from '../../../shared/service/bodegas.service';

@Component({
  selector: 'app-traspasos',
  templateUrl: './traspasos.component.html',
  styleUrls: ['./traspasos.component.scss']
})
export class TraspasosComponent implements OnInit {
  listaProductoBodega: TwProductoBodega[];
  stockTotal: number=0;
  traspaso:boolean=true;
  
  constructor(private bodegasService: BodegasService) { }

  ngOnInit(): void {
   
  }

  
  obtenerBodegas(nId: number){

    
    this.bodegasService.obtenerProductoBodegas(nId).subscribe(productoBodega => {
      this.listaProductoBodega = productoBodega;
      for (const key in this.listaProductoBodega) {
          this.stockTotal += this.listaProductoBodega[key].nCantidad;
      }
      console.log("Es es el stock general"+this.stockTotal);
     
  });
  }

}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { SplitterModule } from 'primeng/splitter';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ProductoService } from '../../../shared/service/producto.service';
import { TcProducto } from '../../model/TcProducto';
import { MessageService } from 'primeng/api';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-input-busqueda',
  templateUrl: './input-busqueda.component.html',
  styleUrls: ['./input-busqueda.component.scss']
})
export class InputBusquedaComponent implements OnInit {

  sNoParte:string;
  debuncer: Subject<string> = new Subject();
  listaNoParte:TcProducto[]; 
  mostrarSugerencias: boolean;
  nId:number;
  producto:TcProducto;
  @Output() consultarPorId: EventEmitter<number> = new EventEmitter();
  @Output() productoSeleccionado: EventEmitter<TcProducto> = new EventEmitter();

  constructor(private productosService:ProductoService, private messageService:MessageService) { }

  ngOnInit(): void {

    this.buscaPorNoParte();
  }

  teclaPresionada(){
  
    if (this.sNoParte.length >=3) {
  
      this.debuncer.next(this.sNoParte);
    }
  
    
  }

  buscaPorNoParte(){

  
    this.debuncer
      .pipe(debounceTime(300))
      .subscribe(valor => {
        
        this.productosService.obtenerNoParte(this.sNoParte).subscribe(noParte => {
          console.log(noParte.length);
          if (noParte.length != 0) {
            this.listaNoParte=noParte;          
            this.mostrarSugerencias=true;
            this.messageService.add({severity: 'info', summary: 'coincidencias', detail: 'Hay números de parte que coinciden', life: 3000});
           
  
          }else{
           
            this.mostrarSugerencias=false;
            this.messageService.add({severity: 'warn', summary: 'no encontrado', detail: 'el número de parte no existe en la base de datos.', life: 3000});
          }
          
         
        })
      })
  
  
}

  valorSeleccionado() {
    //console.log(this.nId);
    this.consultarPorId.emit(this.nId)

    for (let i in this.listaNoParte) {
      if (this.listaNoParte[i].nId == this.nId) {
        this.producto = this.listaNoParte[i];
      }
    }

    this.productoSeleccionado.emit(this.producto);
    this.mostrarSugerencias = false;
    this.sNoParte = '';

  }

}

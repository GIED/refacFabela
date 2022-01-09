import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-venta-pedido',
  templateUrl: './form-venta-pedido.component.html',
  styleUrls: ['./form-venta-pedido.component.scss']
})
export class FormVentaPedidoComponent implements OnInit {

  @Input() listaProductos:TvStockProducto[];
  @Input() saldoGeneralCliente:SaldoGeneralCliente;
  @Input() total:number;
  @Output() emitirVenta: EventEmitter<DatosVenta> = new EventEmitter();
  @Output() cancelar: EventEmitter<any> = new EventEmitter();

  datosVenta:DatosVenta;

  listaValidada:TvStockProducto[];

  formVentas:FormGroup;
  
  

  constructor(private messageService: MessageService) {
    this.listaValidada=[];
    this.datosVenta= { anticipo: null, listaValidada: null};
   }

  ngOnInit(): void {

    
    this.listaValidada=this.listaProductos
    this._initFormGroupVentas();
    this.nAnticipoCtrl.setValue(this.total/2);

   
  }

  _initFormGroupVentas(): void{ 
    this.formVentas=new FormGroup({
      nAnticipoCtrl: new FormControl('',[Validators.required])
    });   
  }

  get nAnticipoCtrl(){
    return this.formVentas.get('nAnticipoCtrl') as FormControl;
  }

 

  quitarProducto(producto: TvStockProducto){
    //console.log(producto);
    
    this.total = this.total - producto.tcProducto.nPrecioConIva*producto.nCantidad;
    this.listaValidada.splice(this.findIndexById(producto.nIdProducto, this.listaValidada),1);
  }


  generarVenta(){

    
      //console.log("lista para guardar");

      if (this.nAnticipoCtrl.value < this.total/2 ) {
        this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'El anticipo para generar el pedido debé ser almenos de: '+this.total/2, life: 3000});
      }else{
        this.datosVenta.anticipo = this.nAnticipoCtrl.value;
        this.datosVenta.listaValidada=this.listaProductos;
        //console.log(this.datosVenta);
        this.emitirVenta.emit(this.datosVenta);
      }

    
  
  
  }

  cancela(){
    this.cancelar.emit();
  }

  

  findIndexById(id: number, arreglo:TvStockProducto[]): number {
    let index = -1;
    for (let i = 0; i < arreglo.length; i++) {
        if (arreglo[i].nIdProducto === id) {
            index = i;
            break;
        }
    }
    //console.log("index: "+index);
    return index;
  }
  

}

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
  muestraCredito:boolean;
  

  constructor(private productoService:ProductoService, private messageService: MessageService,) {
    this.listaValidada=[];
    this.muestraCredito=false;
    this.datosVenta= { tipoPago: null, listaValidada: null};
   }

  ngOnInit(): void {

    
    this.listaValidada=this.listaProductos
    this._initFormGroupVentas();
    this.validaCredito();

   
  }

  _initFormGroupVentas(): void{ 
    this.formVentas=new FormGroup({
      tipoPagoCtrl: new FormControl("0",[Validators.required])
    });   
  }

  get tipoPagoCtrl(){
    return this.formVentas.get('tipoPagoCtrl') as FormControl;
  }

  validaCredito(){
    if (this.saldoGeneralCliente.nCreditoDisponible > 0 && this.saldoGeneralCliente.nCreditoDisponible >= this.total) {
      this.muestraCredito =  true;
    }else{
      this.muestraCredito =  false;
    }
     
  }

  quitarProducto(producto: TvStockProducto){
    //console.log(producto);
    
    this.total = this.total - producto.tcProducto.nPrecioConIva*producto.nCantidad;
    this.listaValidada.splice(this.findIndexById(producto.nIdProducto, this.listaValidada),1);
    this.validaCredito();
  }


  generarVenta(){

    
      //console.log("lista para guardar");

      this.datosVenta.tipoPago = parseInt(this.tipoPagoCtrl.value);
      this.datosVenta.listaValidada=this.listaProductos;

      //console.log(this.datosVenta);

      this.emitirVenta.emit(this.datosVenta);
    
  
  
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

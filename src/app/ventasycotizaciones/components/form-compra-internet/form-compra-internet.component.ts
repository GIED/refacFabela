import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TvStockProducto } from '../../../productos/model/TvStockProducto';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { ProductoService } from '../../../shared/service/producto.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-form-compra-internet',
  templateUrl: './form-compra-internet.component.html',
  styles: [
  ]
})
export class FormCompraInternetComponent implements OnInit {

  @Input() listaProductos:TvStockProducto[];
  @Input() saldoGeneralCliente:SaldoGeneralCliente;
  @Input() total:number;
  @Output() emitirVenta: EventEmitter<DatosVenta> = new EventEmitter();
  @Output() soloCotizacion: EventEmitter<any> = new EventEmitter();

  datosVenta:DatosVenta;

  listaValidada:TvStockProducto[];

  formCompra:FormGroup;
  muestraCredito:boolean;
  

  constructor(private productoService:ProductoService, private messageService: MessageService,) {
    this.listaValidada=[];
    this.muestraCredito=false;
    this.datosVenta= { tipoPago: null, listaValidada: null};
   }

  ngOnInit(): void {

    

    this._initFormGroupCompra();
    this.validaStock();
    this.validaCredito();

   
  }

  _initFormGroupCompra(): void{ 
    this.formCompra=new FormGroup({
      tipoPagoCtrl: new FormControl("0",[Validators.required])
    });   
  }

  get tipoPagoCtrl(){
    return this.formCompra.get('tipoPagoCtrl') as FormControl;
  }

  validaStock(){

     for (const producto of this.listaProductos) {

      console.log("entro a valida stock");
      console.log(producto.nIdProducto);


      this.productoService.obtenerTotalBodegasIdProducto(producto.nIdProducto).subscribe(productoStock =>{
        if (productoStock.nCantidadTotal === 0 || producto.nCantidad > productoStock.nCantidadTotal) {
          producto.nStatus=0;
        }else{
          producto.nStatus=1;
        }
        producto.nCantidadTotal=productoStock.nCantidadTotal;
        
        this.listaValidada.push(producto);
      });

     }
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

    if (this.validaStatusStock(this.listaValidada)) {
      this.messageService.add({severity: 'warn', summary: 'Stock Insuficiente', detail: 'No se puede generar la venta, elimine por favor los productos con stock insuficiente', life: 3000});
    }else{
      //console.log("lista para guardar");

      this.datosVenta.tipoPago = parseInt(this.tipoPagoCtrl.value);
      this.datosVenta.listaValidada=this.listaValidada;

      //console.log(this.datosVenta);

      this.emitirVenta.emit(this.datosVenta);
    }
  
  
  }

  cotizacion(){
    this.soloCotizacion.emit();
  }
  
  validaStatusStock(arreglo:TvStockProducto[]): boolean {
    let valor: boolean = false;
    for (let i = 0; i < arreglo.length; i++) {
        if (arreglo[i].nStatus === 0) {
            valor=true
            break;
        }
    }
    
    return valor;
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

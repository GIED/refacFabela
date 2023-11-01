import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { ProductoService } from '../../../shared/service/producto.service';
import { producto } from '../../../productos/interfaces/producto.interfaces';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { MessageService } from 'primeng/api';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { TokenService } from '../../../shared/service/token.service';

@Component({
  selector: 'app-form-venta',
  templateUrl: './form-venta.component.html',
  styleUrls: ['./form-venta.component.scss']
})
export class FormVentaComponent implements OnInit {

  @Input() listaProductos:TvStockProducto[];
  @Input() saldoGeneralCliente:SaldoGeneralCliente;
  @Input() total:number;
  @Output() emitirVenta: EventEmitter<DatosVenta> = new EventEmitter();
  @Output() soloCotizacion: EventEmitter<any> = new EventEmitter();

  datosVenta:DatosVenta;

  listaValidada:TvStockProducto[];

  formVentas:FormGroup;
  muestraCredito:boolean;
  

  constructor(private productoService:ProductoService, private messageService: MessageService, private tokenService:TokenService) {
    this.listaValidada=[];
    this.muestraCredito=false;
    this.datosVenta= { tipoPago: null, listaValidada: null};
   }

  ngOnInit(): void {

    

    this._initFormGroupVentas();
    this.validaStock();
    this.validaCredito();
   // console.log(this.listaProductos);

   
  }

  _initFormGroupVentas(): void{ 
    this.formVentas=new FormGroup({
      tipoPagoCtrl: new FormControl("0",[Validators.required])
    });   
  }

  get tipoPagoCtrl(){
    return this.formVentas.get('tipoPagoCtrl') as FormControl;
  }

  validaStock(){

     for (const producto of this.listaProductos) {

      //console.log("entro a valida stock");
      // console.log(producto.nIdProducto);


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
    if(this.listaValidada.length===0){
      this.messageService.add({severity: 'warn', summary: 'Sin productos', detail: 'No se puede generar la venta, no se cuenta con productos para generar la venta', life: 3000});
    }
    else if (this.validaStatusStock(this.listaValidada)) {
      this.messageService.add({severity: 'warn', summary: 'Stock Insuficiente', detail: 'No se puede generar la venta, elimine por favor los productos con stock insuficiente', life: 3000});
    }else{
      //console.log("lista para guardar");

      this.datosVenta.tipoPago = parseInt(this.tipoPagoCtrl.value);
      this.datosVenta.listaValidada=this.listaValidada;
      this.datosVenta.idUsuario=this.tokenService.getIdUser();

     // console.log(this.datosVenta);

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

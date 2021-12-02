import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { TwProductoAlternativo } from 'src/app/productos/model/TwProductoAlternativo';
import { ProductoService } from '../../../shared/service/producto.service';
import { producto } from '../../../productos/interfaces/producto.interfaces';

@Component({
  selector: 'app-productos-alternativos-venta',
  templateUrl: './productos-alternativos-venta.component.html',
  styleUrls: ['./productos-alternativos-venta.component.scss']
})
export class ProductosAlternativosVentaComponent implements OnInit {

  @Input() nIdProducto: number;
  @Output() producto: EventEmitter<TvStockProducto> = new EventEmitter();
  formGrp: FormGroup;

  tvStockProducto: TvStockProducto;
  productosFiltrados: TvStockProducto[]=[];
  listaProductoAlternativo: TwProductoAlternativo[] = [];
  muestraConfirmDialog:Boolean = false;
  mostrarAlternativos:Boolean=false;

  constructor(private productoService:ProductoService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService) { }

  ngOnInit(): void {

    this.obtenerProductosAlternativos();
    this._initFormGroup();

  }

  _initFormGroup(): void{ 
    this.formGrp=new FormGroup({
      nCantidadCtrl: new FormControl( 0 , [ ])
    });
  }

  get nCantidadCtrl(){
    return this.formGrp.get('nCantidadCtrl') as FormControl;
  }

  limpiar(){
    console.log('llego a limpiar');
    this.nCantidadCtrl.setValue(0);
  }

  obtenerProductosAlternativos() {
    
    this.productoService.obtenerProductosAlternativos(this.nIdProducto)
      .subscribe((productosAlter) => {
         productosAlter;
        console.log("Alternativos");
        console.log(productosAlter);
        for (const producto of productosAlter) {
          this.tvStockProducto = new TvStockProducto();
          this.productoService.obtenerProductoIdBodegas(producto.nIdProductoAlternativo).subscribe(productoStock =>{
            if (productoStock != null) {
              this.tvStockProducto=productoStock;
              this.productosFiltrados.push(this.tvStockProducto);
            }
          });
          
        }
        console.log(this.productosFiltrados);
        
      });
  }

  agregarProduct(producto: TvStockProducto){

    producto.nCantidad=this.nCantidadCtrl.value;

    if (producto.nCantidad === 0) {
      //console.log("entro a if");
      
      this.messageService.add({severity: 'warn', summary: 'Atención', detail: 'Debe agregar una cantidad', life: 3000});
  
    }else{

      if (producto.nCantidadTotal === 0 || producto.nCantidadTotal < producto.nCantidad) {

        
        this.confirmationService.confirm({
            message: 'El producto ' + producto.tcProducto.sProducto +' no cuenta con stock suficiente para su venta en este momento desea continuar ?',
            header: 'Confirmar',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.producto.emit(producto);
              this.mostrarAlternativos=false;
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Producto agregado a cotización', life: 3000 });    
            },
            reject: (type) => {
                switch (type) {  
                  case ConfirmEventType.REJECT:
                    this.nCantidadCtrl.setValue(0);
                    this.messageService.add({ severity: 'warn', summary: 'Cancelada', detail: 'no se agrego el producto' });
                    
                    break;                             
                }
            }
        });
  
        
      }else{    
        this.mostrarAlternativos=false;   
        this.producto.emit(producto);
      }

    }
   
  }

}

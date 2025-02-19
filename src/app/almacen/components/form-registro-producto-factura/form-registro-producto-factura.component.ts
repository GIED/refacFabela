import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { VwFacturaProductoBalance } from 'src/app/productos/model/VwFacturaProductoBalance';
import { VwMetaProductoCompra } from 'src/app/productos/model/VwMetaProductoCompra';
import { ComprasService } from 'src/app/shared/service/compras.service';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { TcMarca } from 'src/app/productos/model/TcMarca';
import { disable } from 'colors';
import { FormProductoFacturaComponent } from '../form-producto-factura/form-producto-factura.component';
import { ProveedorService } from 'src/app/administracion/service/proveedor.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TwFacturaProveedorProducto } from 'src/app/shared/service/TwFacturaProveedorProducto';

@Component({
  selector: 'app-form-registro-producto-factura',
  templateUrl: './form-registro-producto-factura.component.html',
  styleUrls: ['./form-registro-producto-factura.component.scss']
})
export class FormRegistroProductoFacturaComponent implements OnInit {

   modelContainer: ModelContainer;
   formGrp: FormGroup;
   vwFacturaProductoBalance:VwFacturaProductoBalance;
   listaFacturaProducto:TwFacturaProveedorProducto[];
   cols: any[];
   

  constructor(private comprasService: ComprasService, public ref: DynamicDialogRef, public productoService:ProductoService,
      public config: DynamicDialogConfig, private _catalogoService:CatalogoService,    public dialogService: DialogService, ) { 
      this.formGrp = new FormGroup({});
      this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.vwFacturaProductoBalance=new VwFacturaProductoBalance() ;
    this.listaFacturaProducto=[];

    this.cols = [
      { field: 'tcProducto.sNoParte', header: 'No Parte' },
      { field: 'tcProducto.sProducto', header: 'Producto' },
      { field: 'tcMarca.sMarca', header: 'Marca' },
      { field: 'nPrecioUnitario', header: 'Precio Unitario' },
      { field: 'nCantidad', header: 'Cantidad' },
      { field: 'dFechaRegistro', header: 'Fecha Registro' },
      { field: 'tcUsuario.sNombreUsuario', header: 'Usuario Registra' }
  ];
    
      }

  ngOnInit(): void {  
      
    let modelContainer: ModelContainer = this.config.data;
    this.vwFacturaProductoBalance = ObjectUtils.isEmpty(modelContainer.modelData) ? new VwFacturaProductoBalance() : modelContainer.modelData as VwFacturaProductoBalance;
    this.getProductosFactura();
  }

  /*Recibe el Objeto VwFacturaProductoBalance */
 

  
  /*Este metodo muestra el formulario de registro un producto en la factura */
    onFormProducto(){
      const ref = this.dialogService.open(FormProductoFacturaComponent, {
        data: new ModelContainer(ModeActionOnModel.CREATING, this.vwFacturaProductoBalance),
        header: 'Formulario de registro producto-factura',
         width: '70%',
     height: '70%',
     contentStyle: { 'max-height': '90%', 'overflow': 'auto' },
     baseZIndex: 1000,
     closable: true,
     dismissableMask: true,
     modal: true
    
    })
    ref.onClose.subscribe(() =>{
      ////console.log('data que se recibe al cerrar',data);
      //this.obtenerBodegas(data.nIdProducto);
    })

    }

    getProductosFactura(): void {
      this.productoService.getProductosFacturaId(this.vwFacturaProductoBalance.nId).subscribe(data => {
        this.listaFacturaProducto = data;
        console.log(this.listaFacturaProducto);
      });
    }

    editarProducto(twFacturaProveedorProducto:TwFacturaProveedorProducto){

    }
    eliminarProducto(twFacturaProveedorProducto:TwFacturaProveedorProducto){

    }


   


    
        

}

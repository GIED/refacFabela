import { Component, OnInit } from '@angular/core';
import {  FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TcProducto } from 'src/app/productos/model/TcProducto';
import { VwFacturaProductoBalance } from 'src/app/productos/model/VwFacturaProductoBalance';
import { ComprasService } from 'src/app/shared/service/compras.service';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { FormProductoFacturaComponent } from '../form-producto-factura/form-producto-factura.component';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TwFacturaProveedorProducto } from 'src/app/shared/service/TwFacturaProveedorProducto';
import { ModelContainerData2 } from 'src/app/shared/utils/model-container-data2';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormIngresoProductoComponent } from '../form-ingreso-producto/form-ingreso-producto.component';
import { ProveedorService } from '../../../administracion/service/proveedor.service';
import { TwFacturasProveedor } from '../../../productos/model/TwFacturasProveedor';
import { FormProductoComponent } from 'src/app/productos/components/form-producto/form-producto.component';

@Component({
  selector: 'app-form-registro-producto-factura',
  templateUrl: './form-registro-producto-factura.component.html',
  styleUrls: ['./form-registro-producto-factura.component.scss']
})
export class FormRegistroProductoFacturaComponent implements OnInit {

  modelContainer: ModelContainerData2;
  formGrp: FormGroup;
  vwFacturaProductoBalance: VwFacturaProductoBalance;
  listaFacturaProducto: TwFacturaProveedorProducto[] = [];
  cols: any[];
  tcProductoSeleccionado: TcProducto;
  twFacturaProveedorProducto: TwFacturaProveedorProducto;
  twFacturasProveedor:TwFacturasProveedor=new TwFacturasProveedor();
  entidad:string;
  banCerrarIngreso:boolean=false;
  banCerrarRegistro:boolean=false;


  constructor(
    private comprasService: ComprasService,
    public ref: DynamicDialogRef,
    public productoService: ProductoService,
    public config: DynamicDialogConfig,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
     private messageService: MessageService,
     private proveedorService:ProveedorService
  ) {
    this.formGrp = new FormGroup({});
    this.modelContainer = new ModelContainerData2(ModeActionOnModel.WATCHING);
    this.vwFacturaProductoBalance = new VwFacturaProductoBalance();
    
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
    const modelContainer: ModelContainerData2 = this.config.data;
    this.vwFacturaProductoBalance = ObjectUtils.isEmpty(modelContainer.modelData1) ? new VwFacturaProductoBalance() : modelContainer.modelData1 as VwFacturaProductoBalance;
    this.entidad = ObjectUtils.isEmpty(modelContainer.modelData2) ? '' : modelContainer.modelData2 as string;
    console.log( this.entidad );
    if(this.entidad){
    this.getProductosFactura();}
  }

  onProductoSeleccionado(producto: TcProducto): void {
    this.tcProductoSeleccionado = producto;
    /*Consulta si el producto ya esta agregado */
    if (this.buscarProductoExistente(producto)) {

      this.twFacturaProveedorProducto = this.buscarProductoExistente(producto);
      this.confirm();

    }
    else {

      this.onFormProducto();

    }



  }

  private buscarProductoExistente(productoSeleccionado: TcProducto): TwFacturaProveedorProducto | null {
    return this.listaFacturaProducto.find(producto => producto.tcProducto.nId === productoSeleccionado.nId) || null;
  }

  onFormProducto(): void {

    const model = this.buscarProductoExistente(this.tcProductoSeleccionado)
      ? new ModelContainerData2(ModeActionOnModel.EDITING, this.twFacturaProveedorProducto, this.tcProductoSeleccionado)
      : new ModelContainerData2(ModeActionOnModel.CREATING, this.vwFacturaProductoBalance, this.tcProductoSeleccionado);

    const ref = this.dialogService.open(FormProductoFacturaComponent, {
      data: model,
      header: 'Formulario de registro producto-factura',
      width: '90%',
      height: '80%',
      contentStyle: { 'max-height': '90%', 'overflow': 'auto' },
      baseZIndex: 1000,
      closable: true,
      dismissableMask: true,
      modal: true
    });

    ref.onClose.subscribe(() => {
      this.getProductosFactura();
    });
  }


  onFormProductoIngreso(twFacturaProveedorProducto: TwFacturaProveedorProducto) {
     
    const model =  new ModelContainer(ModeActionOnModel.CREATING, twFacturaProveedorProducto);
    const ref = this.dialogService.open(FormIngresoProductoComponent, {
      data: model,
      header: 'Formulario de registro de ingreso de producto',
      width: '90%',
      height: '80%',
      contentStyle: { 'max-height': '90%', 'overflow': 'auto' },
      baseZIndex: 1000,
      closable: true,
      dismissableMask: true,
      modal: true
    });

    ref.onClose.subscribe(() => {
      this.getProductosFactura();
      this.ref.close();

    });
  }

  getProductosFactura(): void {
    this.productoService.getProductosFacturaId(this.vwFacturaProductoBalance.nId).subscribe(data => {
      this.listaFacturaProducto = data;
      let cerrados=0;
      for (let index = 0; index < this.listaFacturaProducto.length; index++) {
      
        if( this.listaFacturaProducto[index].nEstatus===1){
          cerrados+=1;
        }
      
        
      }

     if(this.entidad==='ingreso'){      
      if(this.listaFacturaProducto.length===cerrados){
        this.banCerrarIngreso=true;
        this.banCerrarRegistro=false;
      }    
      }

      if(this.entidad==='registro'){      
        if(this.listaFacturaProducto.length>0){
          this.banCerrarIngreso=false;
          this.banCerrarRegistro=true;
        }       
        }




    });
  }

  editarProducto(twFacturaProveedorProducto: TwFacturaProveedorProducto): void {

    this.tcProductoSeleccionado = twFacturaProveedorProducto.tcProducto;
    this.twFacturaProveedorProducto = twFacturaProveedorProducto;

    if (this.tcProductoSeleccionado || this.twFacturaProveedorProducto) {
      this.onFormProducto();
    }

  }

 


  confirmCierreRegistro() {
    this.confirmationService.confirm({
      message: '¿Deseas cerrar el registro de productos de la factura?, una ves cerrado no podrás ingresar más productos a la factura',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {

        this.proveedorService.getFacturaProveedor(this.vwFacturaProductoBalance.nId).subscribe(data=>{
     
          this.twFacturasProveedor=data;
    
          if( this.twFacturasProveedor){
            this.twFacturasProveedor.nEstatusIngresoAlmacen=1;
            this.proveedorService.guardaFacturaProveedor(this.twFacturasProveedor).subscribe(data2=>{
              this.twFacturasProveedor=data2;
              console.log("Se cerro el registro de la factura");
              this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Se cerro el registro de facturas del producto', life: 3000 });
              this.ref.close();
            })
    
          }
    
    
        })
     
      },
      reject: () => {

      }
    });
  }


  confirmCierreIngreso() {
    this.confirmationService.confirm({
      message: '¿Deseas cerrar el ingreso de productos de la factura?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {

        this.proveedorService.getFacturaProveedor(this.vwFacturaProductoBalance.nId).subscribe(data=>{
     
          this.twFacturasProveedor=data;
          console.log( this.twFacturasProveedor);
    
          if( this.twFacturasProveedor){
            this.twFacturasProveedor.nEstatusIngresoAlmacen=2;
            this.proveedorService.guardaFacturaProveedor(this.twFacturasProveedor).subscribe(data2=>{
              this.twFacturasProveedor=data2;
              console.log("Se cerro el ingreso de la factura",  this.twFacturasProveedor);
              this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Se cerro el ingreso de facturas del producto', life: 3000 });
              this.ref.close();
            })
    
          }
    
    
        })
     
      },
      reject: () => {

      }
    });
  }

  


  confirmDelete(twFacturaProveedorProducto: TwFacturaProveedorProducto) {
    this.confirmationService.confirm({
      message: '¿Deseas eliminar el producto?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.comprasService.daleteProductoFactura(twFacturaProveedorProducto.nId).subscribe(data=>{
          this.messageService.add({ severity: 'success', summary: 'Mensaje', detail: 'Eliminado con éxito', life: 3000 });
          this.getProductosFactura();
        })
      },
      reject: () => {

      }
    });
  }

  confirm() {
    this.confirmationService.confirm({
      message: '¿El producto ya se encuantra en la lista, deseas actualizarlo?',
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Aceptar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.editarProducto(this.twFacturaProveedorProducto);
      },
      reject: () => {

      }
    });
  }


 formProducto(producto: TcProducto): void {
  const isNuevo = !producto || typeof producto.nId !== 'number' || producto.nId == null || producto.nId === 0;

  const modo = isNuevo ? ModeActionOnModel.CREATING : ModeActionOnModel.EDITING;
  console.log('Este el modo',modo);

  const ref = this.dialogService.open(FormProductoComponent, {
    data: new ModelContainer(modo, producto),
    header: isNuevo ? 'Nuevo Producto' : 'Editar Producto',
    width: '70%',
    height: 'auto',
    baseZIndex: 1000,
    closable: true,
    dismissableMask: true,
    modal: true
  });

   ref.onClose.subscribe((productoGuardado: TcProducto | undefined) => {
    if (productoGuardado) {
      // Aquí puedes actualizar tu lista, tabla, etc.
      console.log('Producto recibido desde el diálogo:', productoGuardado);
      // Ejemplo: recargar lista o actualizar tabla
      //this.informacionProducto(productoGuardado.nId); // o lo que apliques
    } else {
      console.log('El usuario cerró el formulario sin guardar.');
    }
  });
}




}
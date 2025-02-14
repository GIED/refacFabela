import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ProveedorService } from 'src/app/administracion/service/proveedor.service';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';
import { VwFacturaProductoBalance } from 'src/app/productos/model/VwFacturaProductoBalance';
import { FormRegistroProductoFacturaComponent } from '../../components/form-registro-producto-factura/form-registro-producto-factura.component';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';


@Component({
  selector: 'app-registro-producto-factura',
  templateUrl: './registro-producto-factura.component.html',
  styleUrls: ['./registro-producto-factura.component.scss']
})
export class RegistroProductoFacturaComponent implements OnInit {

listaFacturaProveedor:VwFacturaProductoBalance[];
vwFacturaProductoBalance:VwFacturaProductoBalance;

  constructor(private proveedorService:ProveedorService,   public dialogService: DialogService, ) { 
    this.listaFacturaProveedor=[];
    this.vwFacturaProductoBalance=new VwFacturaProductoBalance();
  }

  ngOnInit(): void {

    this.proveedorService.getFacturasEstatusAlmacenEstatus(0).subscribe(data=>{

    this.listaFacturaProveedor=data;

    console.log(this.listaFacturaProveedor);

    })
  }


  mostarRegistroProductoFactura(vwFacturaProductoBalance:VwFacturaProductoBalance){

  

const ref = this.dialogService.open(FormRegistroProductoFacturaComponent, {
     data: new ModelContainer(ModeActionOnModel.CREATING,  vwFacturaProductoBalance),
     header: 'Registro de Productos por factura',
     width: '70%'
 })
 ref.onClose.subscribe(() =>{
   ////console.log('data que se recibe al cerrar',data);
   //this.obtenerBodegas(data.nIdProducto);
 })

  }

}

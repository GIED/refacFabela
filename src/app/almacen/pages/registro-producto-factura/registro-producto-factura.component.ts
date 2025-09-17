import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ProveedorService } from 'src/app/administracion/service/proveedor.service';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';
import { VwFacturaProductoBalance } from 'src/app/productos/model/VwFacturaProductoBalance';
import { FormRegistroProductoFacturaComponent } from '../../components/form-registro-producto-factura/form-registro-producto-factura.component';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ActivatedRoute } from '@angular/router';
import { ModelContainerData2 } from 'src/app/shared/utils/model-container-data2';


@Component({
  selector: 'app-registro-producto-factura',
  templateUrl: './registro-producto-factura.component.html',
  styleUrls: ['./registro-producto-factura.component.scss']
})
export class RegistroProductoFacturaComponent implements OnInit {
listaFacturaProveedor: VwFacturaProductoBalance[] = [];
vwFacturaProductoBalance:VwFacturaProductoBalance;
entidad:string
  constructor(private proveedorService:ProveedorService,   public dialogService: DialogService, private _route: ActivatedRoute ) { 
   
    this.vwFacturaProductoBalance=new VwFacturaProductoBalance();
  }

  ngOnInit(): void {

    /* Se optiene el parametro de la acción*/
    this._route.paramMap.subscribe(params => {
      const entidadRuta = params.get('catalogo')!;
      this.entidad=entidadRuta;

      /*Consulta la lista según el tipo de acción */
      if(this.entidad=='registro'){
        this.consultaFacturaEstatusAlmacen(0);
      }
      if(this.entidad=='ingreso'){
        this.consultaFacturaEstatusAlmacen(1);
      }
     
    });




   
    
  }


  consultaFacturaEstatusAlmacen(nEstatus:number){
    this.proveedorService.getFacturasEstatusAlmacenEstatus(nEstatus).subscribe(data=>{
      this.listaFacturaProveedor=data;  
      console.log( this.listaFacturaProveedor);
      });

  }

  mostarRegistroProductoFactura(vwFacturaProductoBalance:VwFacturaProductoBalance){

  

const ref = this.dialogService.open(FormRegistroProductoFacturaComponent, {
     data: new ModelContainerData2(ModeActionOnModel.EDITING,  vwFacturaProductoBalance, this.entidad ),
     header: 'Registro de Productos de la factura',
      width: '90%',
  height: 'auto',
  contentStyle: { 'max-height': '90%', 'overflow': 'auto' },
  baseZIndex: 1000,
  closable: true,
  dismissableMask: true,
  modal: true
 
 })
 ref.onClose.subscribe(() =>{
  

  if(this.entidad=='registro'){
    this.consultaFacturaEstatusAlmacen(0);
  }
  if(this.entidad=='ingreso'){
    this.consultaFacturaEstatusAlmacen(1);
  }
   
   
 })

  }

}

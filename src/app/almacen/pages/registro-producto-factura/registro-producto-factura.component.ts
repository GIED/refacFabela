import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/administracion/service/proveedor.service';
import { TwFacturasProveedor } from 'src/app/productos/model/TwFacturasProveedor';


@Component({
  selector: 'app-registro-producto-factura',
  templateUrl: './registro-producto-factura.component.html',
  styleUrls: ['./registro-producto-factura.component.scss']
})
export class RegistroProductoFacturaComponent implements OnInit {

listaFacturaProveedor:TwFacturasProveedor[];

  constructor(private proveedorService:ProveedorService) { 
    this.listaFacturaProveedor=[];
  }

  ngOnInit(): void {

    this.proveedorService.getFacturasPendienteIngreso().subscribe(data=>{

    this.listaFacturaProveedor=data;

    console.log(this.listaFacturaProveedor);

    })
  }

}

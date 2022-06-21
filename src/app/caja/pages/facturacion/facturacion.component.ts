import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { FacturaService } from '../../../shared/service/factura.service';
import { TvVentasFactura } from '../../../productos/model/TvVentasFactura';
import { TcUsoCfdi } from '../../../productos/model/TcUsoCfdi';
import { CatalogoService } from '../../../shared/service/catalogo.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.scss']
})
export class FacturacionComponent implements OnInit {

    listaVentas:TvVentasFactura[];
    listaUsoCfdi:TcUsoCfdi[];
    formFactura:boolean;
    idVenta:number;
    totalVenta:number;
    cfdiSeleccionado:string;
    

  constructor(private facturaService: FacturaService, private catalogoService:CatalogoService) {
        this.listaVentas=[];
        this.listaUsoCfdi=[];
        this.formFactura=false;
     }

  ngOnInit(){
   this.facturaService.obtenerVentaFactura().subscribe(resp =>{
       this.listaVentas=resp;
   });

   this.catalogoService.obtenerUsoCfdi().subscribe(resp =>{
     this.listaUsoCfdi=resp;
   });


    
  }

  openDialog(tvVentasFactura:TvVentasFactura){
    this.formFactura=true;
    this.idVenta=tvVentasFactura.nId;
    this.totalVenta=tvVentasFactura.nTotalVenta;
  }

  hideDialog(){
    this.formFactura=false;
  }

  generarFactura(){
    console.log(this.cfdiSeleccionado);
    console.log(this.idVenta);

    this.facturaService.facturarVenta(this.idVenta,this.cfdiSeleccionado).subscribe(resp =>{
      console.log(resp.mensaje);
    });

  }

  

}

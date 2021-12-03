import { Component, OnInit } from '@angular/core';
import { ClienteService } from 'src/app/administracion/service/cliente.service';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';
import { forkJoin } from 'rxjs';
import { DatosVenta } from '../../interfaces/DatosVenta';
import { VentasService } from 'src/app/shared/service/ventas.service';


@Component({
  selector: 'app-consulta-cotizacion',
  templateUrl: './consulta-cotizacion.component.html',
  styleUrls: ['./consulta-cotizacion.component.scss']
})
export class ConsultaCotizacionComponent implements OnInit {

  
  //Estas son las variables que se tienen que quedar
  
  listaCotizaciones: TwCotizacion[];
  listaProductos: TvStockProducto[];
  saldoGeneralCliente:SaldoGeneralCliente;
  mostrarOpcionesVenta:boolean;
  total:number;
  datosRegistraVenta:DatosVenta;
  cotizacionData: TwCotizacion;


  
constructor(private clienteService: ClienteService,private ventaService:VentasService, private ventasCotizacionesService:VentasCotizacionesService) { 
    this.listaCotizaciones=[];
    this.saldoGeneralCliente = new SaldoGeneralCliente();
    this.mostrarOpcionesVenta = false;
    this.total=0;
    this.cotizacionData= new TwCotizacion();
    
  }

ngOnInit(){

  this.ventasCotizacionesService.obtenerCotizaciones().subscribe(data => {
    this.listaCotizaciones=data;
    console.log(this.listaCotizaciones);
  }); 
}


detalleCotizacion(twCotizacion: TwCotizacion){
  this.cotizacionData = twCotizacion;
  let saldo =  this.clienteService.obtenerSaldoGeneralCliente(twCotizacion.tcCliente.nId);

  let productos =  this.ventasCotizacionesService.obtenerCotizacionId(twCotizacion.nId);

  forkJoin([
    saldo,productos
  ]).subscribe(results => {

    if (results[0] != null) {
      this.saldoGeneralCliente=results[0];
    }else{
      this.saldoGeneralCliente.nIdCliente=twCotizacion.tcCliente.nId;
      this.saldoGeneralCliente.nCreditoDisponible=0;
      this.saldoGeneralCliente.nLimiteCredito=twCotizacion.tcCliente.n_limiteCredito;
      this.saldoGeneralCliente.nSaldoTotal=0;
      this.saldoGeneralCliente.tcCliente=twCotizacion.tcCliente;
    }

    this.listaProductos=results[1];

    for (const producto of this.listaProductos) {

      this.total += producto.tcProducto.nPrecioConIva*producto.nCantidad;
    }

    this.mostrarOpcionesVenta=true;

  })

  
}

soloCotizacion(){
  this.mostrarOpcionesVenta=false;
  this.total=0;
}

generarVenta(datosVenta: DatosVenta){

  this.datosRegistraVenta=datosVenta;
  this.datosRegistraVenta.idCliente=this.cotizacionData.nIdCliente;
  this.datosRegistraVenta.sFolioVenta=this.createFolio();
  this.datosRegistraVenta.idTipoVenta=1;
  if (this.datosRegistraVenta.tipoPago === 1) {
    this.datosRegistraVenta.fechaIniCredito=new Date();
    var fin = new Date();
    fin.setDate(fin.getDate() + 30);
    this.datosRegistraVenta.fechaFinCredito=fin;
  }else{
    this.datosRegistraVenta.fechaIniCredito=null;
    this.datosRegistraVenta.fechaFinCredito=null;
  }
  this.datosRegistraVenta.twCotizacion = this.cotizacionData;
  console.log("Datos para venta en padre");
  console.log(this.datosRegistraVenta);
  console.log(this.cotizacionData);

 this.ventaService.guardaVenta(this.datosRegistraVenta).subscribe(resp =>{
    console.log(resp);
  });
  
  


}




createFolio(): string {
  let folio = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for ( let i = 0; i < 5; i++ ) {
    folio += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return folio;
} 

}

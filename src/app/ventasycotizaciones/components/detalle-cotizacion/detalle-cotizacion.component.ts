import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TcCliente } from 'src/app/administracion/model/TcCliente';
import { ClienteService } from 'src/app/administracion/service/cliente.service';
import { TwCotizacion } from 'src/app/productos/model/TcCotizacion';
import { TvStockProducto } from 'src/app/productos/model/TvStockProducto';
import { VentasCotizacionesService } from 'src/app/shared/service/ventas-cotizaciones.service';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';

@Component({
  selector: 'app-detalle-cotizacion',
  templateUrl: './detalle-cotizacion.component.html',
  styleUrls: ['./detalle-cotizacion.component.scss']
})
export class DetalleCotizacionComponent implements OnInit {

  @Input() listaCotizaciones: TwCotizacion[];
  @Output() cotizacionSeleccionada: EventEmitter<TwCotizacion> = new EventEmitter();

  
  listaProductos: TvStockProducto[];
  saldoGeneralCliente:SaldoGeneralCliente;
  mostrarOpcionesVenta:boolean;



  
 

  constructor(private clienteService: ClienteService, private ventasCotizacionesService:VentasCotizacionesService) { 
    this.listaCotizaciones=[];
    this.mostrarOpcionesVenta=false;

    this.listaProductos=[];
    this.saldoGeneralCliente = new SaldoGeneralCliente();
  }

  ngOnInit(): void {
  }

  consultaSaldo(twCotizacion: TwCotizacion){
    const _this = this;
    this.clienteService.obtenerSaldoGeneralCliente(twCotizacion.tcCliente.nId).subscribe(saldoCliente=>{
      if (saldoCliente != null) {
        _this.saldoGeneralCliente=saldoCliente;
      }else{
        this.saldoGeneralCliente.nIdCliente=twCotizacion.tcCliente.nId;
        this.saldoGeneralCliente.nCreditoDisponible=0;
        this.saldoGeneralCliente.nLimiteCredito=twCotizacion.tcCliente.n_limiteCredito;
        this.saldoGeneralCliente.nSaldoTotal=0;
        this.saldoGeneralCliente.tcCliente=twCotizacion.tcCliente;
      }
      
    });
  }

  consultaProductos(idCotizacion: number){
    
    this.ventasCotizacionesService.obtenerCotizacionId(idCotizacion).subscribe(listaProductos =>{
     this.asignaLista(listaProductos);
     
    });
  }
  
  asignaLista(tvStockProducto: TvStockProducto[]){
    this.listaProductos= tvStockProducto;
    
  }

  detalleCotizacion(twCotizacion: TwCotizacion){


    this.consultaSaldo(twCotizacion);
    this.consultaProductos(twCotizacion.nId);

    console.log( this.saldoGeneralCliente);
    console.log( this.listaProductos);
    this.mostrarOpcionesVenta=true;
    
  }

}

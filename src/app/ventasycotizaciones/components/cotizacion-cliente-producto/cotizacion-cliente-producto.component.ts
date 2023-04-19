import { Component, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TwCotizacionProducto } from 'src/app/productos/model/TwCotizacionProducto';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { VentasCotizacionesService } from '../../../shared/service/ventas-cotizaciones.service';

@Component({
  selector: 'app-cotizacion-cliente-producto',
  templateUrl: './cotizacion-cliente-producto.component.html',
  styleUrls: ['./cotizacion-cliente-producto.component.scss']
})
export class CotizacionClienteProductoComponent implements OnInit {

  @Input() nICliente:number;
  @Input() nIProducto:number;

  listaProductoCortizacion:TwCotizacionProducto[];
  constructor(private messageService: MessageService, private ventasCotizacionesService: VentasCotizacionesService) { }

  ngOnInit(): void {
    this.listaProductoCortizacion=[];

    console.log(this.nICliente);
    console.log(this.nIProducto);
    this.consultar();

  }

  consultar(){
    this.ventasCotizacionesService.obtenerCotizacionProductoCliente(this.nICliente,this.nIProducto).subscribe(data=>{
      this.listaProductoCortizacion=data;

      console.log(this.listaProductoCortizacion);

    });
  }

}

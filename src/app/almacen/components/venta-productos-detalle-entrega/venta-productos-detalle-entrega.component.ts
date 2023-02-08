import { MessageService } from 'primeng/api';
import { Component, Input, OnInit } from '@angular/core';
import { VentaProductoDto } from 'src/app/ventasycotizaciones/model/dto/VentaProductoDto';
import { TwVenta } from '../../../productos/model/TwVenta';
import { VentasService } from '../../../shared/service/ventas.service';

@Component({
  selector: 'app-venta-productos-detalle-entrega',
  templateUrl: './venta-productos-detalle-entrega.component.html',
  styleUrls: ['./venta-productos-detalle-entrega.component.scss']
})
export class VentaProductosDetalleEntregaComponent implements OnInit {

  @Input() listaProductosVenta:VentaProductoDto;
  selectedProducts2:VentaProductoDto;
  
  constructor(public ventasService:VentasService, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  onSaveClicked(ventaProductoDto: VentaProductoDto){

    //console.log(ventaProductoDto);
    this.ventasService.guardaVentaProductoId(ventaProductoDto).subscribe(data =>{
      this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Producto actualizado correctamente', life: 3000 });

    });


  }

}

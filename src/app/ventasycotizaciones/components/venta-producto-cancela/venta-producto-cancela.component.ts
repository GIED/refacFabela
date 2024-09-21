import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TwProductoCancela } from '../../../productos/model/TwProductoCancela';
import { TokenService } from 'src/app/shared/service/token.service';
import { MessageService } from 'primeng/api';
import { VentasService } from 'src/app/shared/service/ventas.service';

@Component({
  selector: 'app-venta-producto-cancela',
  templateUrl: './venta-producto-cancela.component.html',
  styleUrls: ['./venta-producto-cancela.component.scss']
})
export class VentaProductoCancelaComponent implements OnInit {
  
  @Input() nIdVenta: number;
  @Output() cerrar: EventEmitter<boolean>= new EventEmitter();
  listaProductosCancela:TwProductoCancela[];
  constructor(
    private ventasService:VentasService, 
    private messageService: MessageService, private tokenService: TokenService

  ) { }

  ngOnInit(): void {
   this.consultarCancelados();
    
  }

  consultarCancelados(){
   
    this.ventasService.consultaVentaCancelaId(this.nIdVenta).subscribe(data=>{

      this.listaProductosCancela=data;


    })
 
  }

}

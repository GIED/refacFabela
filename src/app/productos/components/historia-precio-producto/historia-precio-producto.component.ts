import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { TcProducto } from '../../model/TcProducto';
import { TcHistoriaPrecioProducto } from '../../model/TcHistoriaPrecioProducto';

@Component({
  selector: 'app-historia-precio-producto',
  templateUrl: './historia-precio-producto.component.html',
  styleUrls: ['./historia-precio-producto.component.scss']
})
export class HistoriaPrecioProductoComponent implements OnInit {
  

  @Input() listaHistoriaPrecioProducto: TcHistoriaPrecioProducto;

   

    constructor() { }

  ngOnInit(): void {
   
  }

  
}

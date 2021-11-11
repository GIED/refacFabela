import { Component, Input, OnInit } from '@angular/core';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';

@Component({
  selector: 'app-detalle-cliente',
  templateUrl: './detalle-cliente.component.html',
  styleUrls: ['./detalle-cliente.component.scss']
})
export class DetalleClienteComponent implements OnInit {

  @Input() saldoGeneralCliente:SaldoGeneralCliente;

  constructor() { }

  ngOnInit(): void {
  }

}

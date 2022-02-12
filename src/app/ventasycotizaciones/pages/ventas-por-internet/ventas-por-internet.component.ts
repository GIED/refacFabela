import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../shared/service/token.service';
import { ClienteService } from '../../../administracion/service/cliente.service';
import { TcCliente } from '../../../administracion/model/TcCliente';
import { SaldoGeneralCliente } from '../../model/TvSaldoGeneralCliente';

@Component({
  selector: 'app-ventas-por-internet',
  templateUrl: './ventas-por-internet.component.html',
  styleUrls: ['./ventas-por-internet.component.scss']
})
export class VentasPorInternetComponent implements OnInit {

  tcCliente: TcCliente;
  saldoGeneralCliente: SaldoGeneralCliente;

  constructor(private tokenService: TokenService, private clienteService:ClienteService) {
    this.tcCliente = new TcCliente();
    this.saldoGeneralCliente= new SaldoGeneralCliente();
  }

  ngOnInit(): void {

    this.consultarCliente();

  }

  consultarCliente(){
    this.clienteService.consultaClienteIdUsuario(this.tokenService.getIdUser()).subscribe(resp => {
      this.tcCliente = resp;

      this.clienteService.obtenerSaldoGeneralCliente(this.tcCliente.nId).subscribe(saldoCliente=>{
        if (saldoCliente != null) {
          this.saldoGeneralCliente=saldoCliente;
        }else{
          this.saldoGeneralCliente.nIdCliente=this.tcCliente.nId;
          this.saldoGeneralCliente.nCreditoDisponible=this.tcCliente.n_limiteCredito;
          this.saldoGeneralCliente.nLimiteCredito=this.tcCliente.n_limiteCredito;
          this.saldoGeneralCliente.nSaldoTotal=0;
          this.saldoGeneralCliente.tcCliente=this.tcCliente;
        }    
      });

    });

    

    
  }

}

import { Clientes } from '../../administracion/interfaces/clientes';
export class SaldoGeneralCliente{
    nIdCliente: number;
	nLimiteCredito: number;
	nSaldoTotal: number;
    nCreditoDisponible: number;
    tcCliente: Clientes;
    nSaldoUtilizado:number;
    nAvanceCredito:number;
    nEstatus:string;

}
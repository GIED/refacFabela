import Decimal from 'decimal.js';
import { Clientes } from '../../administracion/interfaces/clientes';
export class SaldoGeneralCliente{
    nIdCliente: number;
	nLimiteCredito: Decimal;
	nSaldoTotal: Decimal;
    nCreditoDisponible: Decimal;
    tcCliente: Clientes;
    nSaldoUtilizado:Decimal;
    nAvanceCredito:number;
    nEstatus:string;

}
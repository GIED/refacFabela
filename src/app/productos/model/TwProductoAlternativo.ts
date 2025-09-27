import { TcProducto } from './TcProducto';
export class TwProductoAlternativo {
  nId: number;
  nEstatus: number;
  nIdProductoAlternativo: number;
  nIdProducto: number;
  tcProductoAlternativo: TcProducto;



  constructor(nId:number, nEstatus:number,nIdProductoAlternaivo:number, nIdProducto:number, tcProductoAlternativo:TcProducto){
    this.nId=nId;
    this.nEstatus=nEstatus;
    this.nIdProducto=nIdProducto;
    this.nIdProductoAlternativo=nIdProductoAlternaivo;
    this.tcProductoAlternativo=tcProductoAlternativo;
  }

}

import {Component, OnInit} from '@angular/core';
import { Product } from '../../../demo/domain/product';
import { ProductService } from '../../../demo/service/productservice';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { SaldoGeneralCliente } from '../../../ventasycotizaciones/model/TvSaldoGeneralCliente';
import { ClienteService } from '../../service/cliente.service';
import { totalesGeneralesCreditos } from '../../interfaces/totalesGeneralesCredito';
import { VentasService } from '../../../shared/service/ventas.service';
import { TvVentasDetalle } from '../../../productos/model/TvVentasDetalle';
import { TwAbono } from '../../../productos/model/TwAbono';

@Component({
  selector: 'app-creditos',
  templateUrl: './creditos.component.html',
  styleUrls: ['./creditos.component.scss'],
  styles: [`
  :host ::ng-deep .p-dialog .product-image {
      width: 150px;
      margin: 0 auto 2rem auto;
      display: block;
  }

  @media screen and (max-width: 960px) {
      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:last-child {
          text-align: center;
      }

      :host ::ng-deep .p-datatable.p-datatable-customers .p-datatable-tbody > tr > td:nth-child(6) {
          display: flex;
      }
  }
 

`],
})
export class CreditosComponent implements OnInit {

  cols:any;
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  submitted: boolean; 
 

  /*listas y variables actuales*/

  listaClientesCredito: SaldoGeneralCliente;
  listaAbonosVenta:TwAbono[];
  listaVentasDetalleCliente: TvVentasDetalle[];
  totalesCreditos: totalesGeneralesCreditos ;
  pieData: any;
  pieOptions: any;
  car:any
  productDialog: boolean;
  productDialog2: boolean;

  constructor(private productService: ProductService, private messageService: MessageService,
              private confirmationService: ConfirmationService, private clienteService:ClienteService, private ventasService: VentasService) {
                  this.totalesCreditos={};
     
  }

  ngOnInit() {

    this.clienteService.obtenerSaldosClientes().subscribe(data=>{
        this.listaClientesCredito=data;       
       this.totalesCreditos= this.obtenerTotalesCreditos(this.listaClientesCredito);       
      console.log(this.totalesCreditos);
      this.generarGrafica(this.totalesCreditos);
    });      
   
    this.car = [
        { total: '',abono: '',  saldo: '',  nabono: '',  ntotal: ''}
       
    ];

   
  }

  generarGrafica(totalesCreditos: totalesGeneralesCreditos){

    this.pieData = {
        labels: ['Saldo General', 'Abono General'],
        datasets: [
            {
                data: [this.totalesCreditos.nSaldoTotalGeneral, this.totalesCreditos.nAbonos],
                backgroundColor: [
                    'red',
                    'green',
                   
                ]
            }]
    };
    this.pieOptions = {
        plugins: {
            legend: {
                labels: {
                    fontColor: '#A0A7B5'
                },
                
            }
        },
      
    };

  }


  obtenerTotalesCreditos(listaClientesCredito:SaldoGeneralCliente){
      this.totalesCreditos.nSaldoTotalGeneral=0;
      this.totalesCreditos.nTotalRegular=0;
      this.totalesCreditos.nTotalVencidos=0;
      this.totalesCreditos.nAbonos=0;
      this.totalesCreditos.nTotalVenta=0;

    for(let i in listaClientesCredito){
        if(listaClientesCredito[i].sEstatus==="REGULAR"){
            this.totalesCreditos.nTotalRegular+=1;        

        }
        if(listaClientesCredito[i].sEstatus==="VENCIDO"){
            this.totalesCreditos.nTotalVencidos+=1;    

        }
        this.totalesCreditos.nSaldoTotalGeneral+=listaClientesCredito[i].nSaldoTotal;   
        this.totalesCreditos.nAbonos+=listaClientesCredito[i].nAbonos;   
        this.totalesCreditos.nTotalVenta+=listaClientesCredito[i].nTotalVenta;    

    }
  return this.totalesCreditos

  }

  obtenerAbonosVentaId(tvVentasDetalle:TvVentasDetalle) {
     console.log(tvVentasDetalle);
      this.productDialog2 = true;

      this.ventasService.obtenerAbonosVentaId(tvVentasDetalle.nId).subscribe(data=>{
        this.listaAbonosVenta=data;       
      console.log(this.listaAbonosVenta);
    });      

  }

  deleteSelectedProducts() {
      this.confirmationService.confirm({
          message: 'Deseas borrar los clientes seleccionandos?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => !this.selectedProducts.includes(val));
              this.selectedProducts = null;
              this.messageService.add({severity: 'success', summary: 'Operación confirmda', detail: 'Clientes borrados', life: 3000});
          }
      });
  }

  consultaVentaDetalle(saldoGeneralCliente: SaldoGeneralCliente) {
     console.log(saldoGeneralCliente);
      this.productDialog = true;

    this.ventasService.obtenerVentaDetalleTipoPago(saldoGeneralCliente.tcCliente.nId, 1).subscribe(data=>{
        this.listaVentasDetalleCliente=data;       
      console.log(this.listaVentasDetalleCliente);
    });      



  }

  deleteProduct(product: Product) {
      this.confirmationService.confirm({
          message: 'Realmente quieres borrar el cliente ' + product.name + '?',
          header: 'Confirmar',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
              this.products = this.products.filter(val => val.id !== product.id);
              this.product = {};
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente eliminado', life: 3000});
          }
      });
  }

  hideDialog() {
      this.productDialog = false;
      this
      .submitted = false;
  }
  hideDialog2() {
    this.productDialog2 = false;
    this.submitted = false;
}


  saveProduct() {
      this.submitted = true;

      if (this.product.name.trim()) {
          if (this.product.id) {
              this.products[this.findIndexById(this.product.id)] = this.product;
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente actualizado', life: 10000});
          }
          else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({severity: 'success', summary: 'Successful', detail: 'Cliente guardado', life: 10000});
          }

          this.products = [...this.products];
          this.productDialog = false;
          this.product = {};
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.products.length; i++) {
          if (this.products[i].id === id) {
              index = i;
              break;
          }
      }

      return index;
  }

  createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for ( let i = 0; i < 5; i++ ) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }

  

  

}

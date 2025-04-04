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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ThrowStmt } from '@angular/compiler';

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

  
  products: Product[];
  product: Product;
  selectedProducts: Product[];
  submitted: boolean; 
  formulario:FormGroup;
 

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
  cols:any;
  tvVentasDetalle:TvVentasDetalle;
  auxSaldoGeneralCliente: SaldoGeneralCliente;

  constructor(private productService: ProductService, private messageService: MessageService,
              private confirmationService: ConfirmationService, private clienteService:ClienteService, private ventasService: VentasService, private fb: FormBuilder) {
                  this.totalesCreditos={};

                  this.cols = [
                    { field: 'tcCliente.sRfc', header: 'RFC' },
                    { field: 'tcCliente.sRazonSocial', header: 'Razón Social' },
                    { field: 'nLimiteCredito', header: 'Limite Crédito' },
                    { field: 'nCreditoDisponible', header: 'Crédito Disponible' },
                    { field: 'nSaldoTotal', header: 'Saldo' },
                    { field: 'nTotalVenta', header: 'Total Venta' },
                    { field: 'nAbonos', header: 'Abonos' },   
                    { field: 'nAvanceCredito', header: 'Avance Crédito' },
                    { field: 'sEstatus', header: 'Estatus' }
        
                ]
                this.tvVentasDetalle={};

                this.crearFormulario();
     
  }

  ngOnInit() {

   this.consultaSaldosCliente();
   
    this.car = [
        { total: '',abono: '',  saldo: '',  nabono: '',  ntotal: ''}
       
    ];

   
  }

  consultaSaldosCliente(){
    this.clienteService.obtenerSaldosClientes().subscribe(data=>{
      this.listaClientesCredito=data;       
     this.totalesCreditos= this.obtenerTotalesCreditos(this.listaClientesCredito);       
    //console.log(this.totalesCreditos);
    this.generarGrafica(this.totalesCreditos);
    //console.log( this.listaClientesCredito);
  });      

  }

  genenerAbonoVentaPDF(tvVentasDetalle:TvVentasDetalle){
 
    this.ventasService.generarAbonoVentaPdf(tvVentasDetalle.nId).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'abono_'+tvVentasDetalle.nId+'_'+tvVentasDetalle.nIdCliente+'.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'comprobante de abono Generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Se realizó con éxito', detail: 'Error al generar el comprobante de abono', life: 3000});
      }

  });

  }

  genenerHistorialAbonoVentaPDF(saldoGeneralCliente: SaldoGeneralCliente){

    //console.log("este es el el id del cliente"+saldoGeneralCliente.nIdCliente);
 
    this.ventasService.generarHistorialAbonoVentaPdf(saldoGeneralCliente.nIdCliente).subscribe(resp => {

    
      const file = new Blob([resp], { type: 'application/pdf' });
      //console.log('file: ' + file.size);
      if (file != null && file.size > 0) {
        const fileURL = window.URL.createObjectURL(file);
        const anchor = document.createElement('a');
        anchor.download = 'historial_abono_'+saldoGeneralCliente.nIdCliente+'.pdf';
        anchor.href = fileURL;
        anchor.click();
        this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'historial de créditos del cliente generado', life: 3000});
        //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
       
      } else {
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el historial de créditos del cliente generado', life: 3000});
      }

  });

  }


  crearFormulario() {
  
    this.formulario = this.fb.group({
        
        abono: ['',[Validators.required]],
        idFormaPago: ['',[Validators.required]],
        
        
    })
    
  }

  generarGrafica(totalesCreditos: totalesGeneralesCreditos){

    this.pieData = {
        labels: ['Saldo General', 'Abono General'],
        datasets: [
            {
                data: [this.totalesCreditos.nSaldoTotalGeneral, this.totalesCreditos.nAbonos],
                backgroundColor: [
                    '#70B5C8',
                    '#96B97A',
                   
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

  refrescar(bandera: boolean){

    if(bandera){
      this.consultaSaldosCliente();
      this.consultaVentaDetalleId(this.auxSaldoGeneralCliente);

    }

  }

  obtenerAbonosVentaId(tvVentasDetalle:TvVentasDetalle) {
     //console.log(tvVentasDetalle);
      this.productDialog2 = true;
      this.tvVentasDetalle=tvVentasDetalle;

      this.ventasService.obtenerAbonosVentaId(this.tvVentasDetalle.nId).subscribe(data=>{
        this.listaAbonosVenta=data;       
      //console.log(this.listaAbonosVenta);
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
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Clientes borrados', life: 3000});
          }
      });
  }

  consultaVentaDetalleId(saldoGeneralCliente: SaldoGeneralCliente) {
     //console.log(saldoGeneralCliente);
      this.productDialog = true;
     this.auxSaldoGeneralCliente=saldoGeneralCliente;
    this.ventasService.obtenerVentaDetalleTipoPago(saldoGeneralCliente.tcCliente.nId, 1).subscribe(data=>{
        this.listaVentasDetalleCliente=data;  
             
      //console.log(this.listaVentasDetalleCliente);
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
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente eliminado', life: 3000});
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
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000});
          }
          else {
              this.product.id = this.createId();
              this.product.image = 'product-placeholder.svg';
              this.products.push(this.product);
              this.messageService.add({severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente guardado', life: 10000});
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
  

  

  get validaAbono() {
    return this.formulario.get('abono').invalid && this.formulario.get('abono').touched;
  }
  get validaFormaPago() {
    return this.formulario.get('idFormaPago').invalid && this.formulario.get('idFormaPago').touched;
  }

  

  

}

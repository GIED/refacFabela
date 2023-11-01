import { Component, OnInit } from '@angular/core';
import { Product } from '../../../demo/domain/product';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ClienteService } from '../../service/cliente.service';
import { Clientes } from '../../interfaces/clientes';
import { FormGroup } from '@angular/forms';
import { TokenService } from '../../../shared/service/token.service';
import { TcRegimenFiscal } from '../../../productos/model/TcRegimenFiscal';
import { isEmpty } from 'rxjs/operators';
import { SaldoGeneralCliente } from '../../../ventasycotizaciones/model/TvSaldoGeneralCliente';



@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['../../../tabledemo.scss'],
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
export class ClienteComponent implements OnInit {

  listaClientes: Clientes[] = [];
  clienteDialog: boolean;
  selectedProducts: Product[];
  submitted: boolean;
  credito: boolean;
  cliente: Clientes;
  formulario: FormGroup;
  listaRegimenFiscal: TcRegimenFiscal[];
  objCliente: Clientes;
  saldoGeneralCliente:SaldoGeneralCliente;

  constructor(private messageService: MessageService,
    private confirmationService: ConfirmationService, private clienteService: ClienteService,
    private tokenService: TokenService) {

    this.listaRegimenFiscal = [];

  }

  ngOnInit() {
    this.obtenerClientes();

  }

  // Carga de clientes inicial(Todos)
  obtenerClientes() {
    this.clienteService.getClientes().subscribe(clientes => {
      this.listaClientes = clientes;
    
    });
    ;
  }

  openNew() {
    this.cliente = {};
    this.submitted = false;
    this.clienteDialog = true;
    this.objCliente = {};

  }
  lineaCredito(clientes: Clientes) {
    //console.log(clientes);
    this.cliente = clientes;

    this.submitted = false;
    this.credito = true;
  }

  //edita los daros del cliente
  editar(cliente: Clientes) {
    this.clienteDialog = true;
    this.objCliente = cliente;
  }



  //Elimina (cambia estatus de clieente como eliminación logica del registro)
  eliminar(cliente: Clientes) {
    this.confirmationService.confirm({
      message: 'Realmente quieres borrar el cliente ' + cliente.sRazonSocial + '?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        cliente.nEstatus = 0;
        this.clienteService.guardaCliente(cliente).subscribe(respuesta => {

          this.listaClientes = this.listaClientes.filter(val => val.nId !== cliente.nId);
          this.cliente = {};
          this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente eliminado', life: 3000 });
        })
      }
    });
  }

  hideDialog(event: boolean) {

    this.clienteDialog = false;
    this.credito = false;
    this.submitted = false;
    this.obtenerClientes();
  }



  guardarLineaCredito() {
     
    this.clienteService.obtenerSaldoGeneralCliente(this.cliente.nId).subscribe(data=>{

      this.saldoGeneralCliente=data;

      if(    this.saldoGeneralCliente != null ||     this.saldoGeneralCliente != undefined){

        if (this.cliente.nId && (this.cliente.n_limiteCredito>=this.saldoGeneralCliente.nSaldoTotal) ) {
          this.cliente.nEstatus = 1;
          this.cliente.n_idUsuarioCredito = this.tokenService.getIdUser();
          this.clienteService.guardaCliente(this.cliente).subscribe(respuesta => {
            this.listaClientes[this.findIndexById(respuesta.nId.toString())] = respuesta;
            this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000 });
            this.credito = false;
          })
          this.listaClientes = [...this.listaClientes];
        }
        else{
          this.messageService.add({ severity: 'info', summary: 'El limite de crédito no puede ser menor al adeudo actual que es de:'+this.saldoGeneralCliente.nSaldoTotal, detail: 'Cliente no actualizado', life: 10000 });


        }
        
      }

      else{

        this.cliente.nEstatus = 1;
        this.cliente.n_idUsuarioCredito = this.tokenService.getIdUser();
        this.clienteService.guardaCliente(this.cliente).subscribe(respuesta => {
          this.listaClientes[this.findIndexById(respuesta.nId.toString())] = respuesta;
          this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000 });
          this.credito = false;
        })
        this.listaClientes = [...this.listaClientes];




      }




    })



    
   
  }


  //busqueda por id del cliente y regresa el index
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.listaClientes.length; i++) {
      if (this.listaClientes[i].nId === parseInt(id)) {
        index = i;
        break;
      }
    }
    return index;
  }

  //Crear una nueva clave de cliente
  crearId(): string {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  guardarDescuento(cliente:Clientes){

 // console.log(cliente.nDescuento);

this.clienteService.guardaCliente(cliente).subscribe(data=>{
  this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000 });

})




  }




}

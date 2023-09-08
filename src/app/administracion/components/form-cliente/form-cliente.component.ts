import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { UsuarioService } from '../../service/usuario.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { ClienteService } from '../../service/cliente.service';
import { TcRegimenFiscal } from 'src/app/productos/model/TcRegimenFiscal';
import { Clientes } from '../../interfaces/clientes';

@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss']
})
export class FormClienteComponent implements OnInit {


  @Output() cerrar: EventEmitter<boolean> = new EventEmitter();
  @Input() objCliente: Clientes;
  formulario: FormGroup;
  listaRegimenFiscal: TcRegimenFiscal[];
  listaClientes: Clientes[] = [];
  clienteDialog: boolean;
  submitted: boolean;
  credito: boolean;
  cliente: Clientes;
  constructor(
    private catalogoService: CatalogoService,
    private productosService: ProductoService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private tokenService: TokenService,
    private confirmationService: ConfirmationService,
    private clienteService: ClienteService,
    private fb: FormBuilder,
  ) {
    this.crearFormulario();
    this.listaRegimenFiscal = [];
    this.limpiarFormulario();
  }

  ngOnInit(): void {
    this.limpiarFormulario();
    this.obtenerRegimenFiscal();
    this.crearFormulario();


    if (this.objCliente !== undefined && this.objCliente !== null) {
      this.editar();
    }





  }
  crearFormulario() {
    this.formulario = this.fb.group({
      nId: ['', []],
      sRfc: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(14)]],
      sRazonSocial: ['', [Validators.required]],
      sDireccion: ['', [Validators.required]],
      sTelefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      sCorreo: ['', [Validators.required, Validators.email]],
      nCp: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5), Validators.pattern('^[0-9]{5}')]],
      sClave: ['', []],
      nIdRegimenFiscal: ['', [Validators.required]],

    })

  }
  // Validación de campos Guardar Cliente
  get validaRfc() {
    return this.formulario.get('sRfc').invalid;
  }
  get validaRS() {
    return this.formulario.get('sRazonSocial').invalid && this.formulario.get('sRazonSocial').touched;
  }
  get validaDireccion() {
    return this.formulario.get('sDireccion').invalid && this.formulario.get('sDireccion').touched;
  }
  get validaTelefono() {
    return this.formulario.get('sTelefono').invalid && this.formulario.get('sTelefono').touched;
  }
  get validaCorreo() {
    return this.formulario.get('sCorreo').invalid && this.formulario.get('sCorreo').touched;
  }
  get validaCp() {
    return this.formulario.get('nCp').invalid && this.formulario.get('nCp').touched;
  }
  get validaRegimenfiscal() {
    return this.formulario.get('nIdRegimenFiscal').invalid && this.formulario.get('nIdRegimenFiscal').touched;
  }

  openNew(productDialog: boolean) {
    this.cliente = {};
    this.submitted = false;
    this.clienteDialog = true;
    this.limpiarFormulario();
  }
  limpiarFormulario() {
    this.fclientes.nId.setValue("");
    this.fclientes.sCorreo.setValue("");
    this.fclientes.sTelefono.setValue("");
    this.fclientes.sDireccion.setValue("");
    this.fclientes.sRazonSocial.setValue("");
    this.fclientes.sRfc.setValue("");
    this.fclientes.sClave.setValue("");
    this.fclientes.nCp.setValue("");
    this.fclientes.nIdRegimenFiscal.setValue("");
  }

  obtenerRegimenFiscal() {
    this.clienteService.obtenerRegimenFiscal().subscribe(data => {
      this.listaRegimenFiscal = data;
    })
  }

  editar() {
    this.clienteDialog = true;


    this.fclientes.nId.setValue(this.objCliente.nId);
    this.fclientes.sCorreo.setValue(this.objCliente.sCorreo);
    this.fclientes.sTelefono.setValue(this.objCliente.sTelefono);
    this.fclientes.sDireccion.setValue(this.objCliente.sDireccion);
    this.fclientes.sRazonSocial.setValue(this.objCliente.sRazonSocial);
    this.fclientes.sRfc.setValue(this.objCliente.sRfc);
    this.fclientes.sClave.setValue(this.objCliente.sClave);
    this.fclientes.nCp.setValue(this.objCliente.nCp);
    if (this.objCliente.tcRegimenFiscal !== null && this.objCliente.tcRegimenFiscal !== undefined ) {
      //console.log('entre');
      this.fclientes.nIdRegimenFiscal.setValue(this.objCliente.tcRegimenFiscal.nId);
    }

  }

  get fclientes() {
    return this.formulario.controls
  }

  hideDialog() {
    this.clienteDialog = false;
    this.credito = false;
    this.submitted = false;
    this.limpiarFormulario();
    this.cerrar.emit(true);
  }

  guardar() {

    if (this.formulario.invalid) {
      return Object.values(this.formulario.controls).forEach(control => {
        if (control instanceof FormGroup) {
          // tslint:disable-next-line: no-shadowed-variable
          Object.values(control.controls).forEach(control => control.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
    }
    else {
      this.cliente = this.formulario.value;


      if (this.cliente.nId) {
        this.cliente.nEstatus = 1;
        this.cliente.nDescuento=this.objCliente.nDescuento;
        this.clienteService.guardaCliente(this.cliente).subscribe(respuesta => {
          this.listaClientes[this.findIndexById(respuesta.nId.toString())] = respuesta;
          this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000 });
        })


      }
      else {
        this.cliente.sClave = this.crearId();
        this.cliente.nEstatus = 1;
        this.cliente.nDescuento=0;
        this.clienteService.guardaCliente(this.cliente).subscribe(respuesta => {
          this.listaClientes.push(respuesta);
          this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente guardado', life: 10000 });
        })
      }

      this.listaClientes = [...this.listaClientes];
      this.cerrar.emit(true);
      this.cliente = {};

    }
  }


  consultaRfc() {

    if (this.fclientes.sRfc.value.length >= 5) {
      this.clienteService.consultaClienteRfc(this.fclientes.sRfc.value).subscribe(data => {
        if (data !== null) {
          //console.log('entre a asignar los valores para editar')
          this.objCliente = data;
          this.editar();
        }
        else {
          this.objCliente = {};
        }
      })
    }
  }


  guardarLineaCredito() {

    if (this.cliente.nId) {
      this.cliente.nEstatus = 1;
      this.cliente.n_idUsuarioCredito = this.tokenService.getIdUser();
      this.clienteService.guardaCliente(this.cliente).subscribe(respuesta => {
        this.listaClientes[this.findIndexById(respuesta.nId.toString())] = respuesta;
        this.messageService.add({ severity: 'success', summary: 'Se realizó con éxito', detail: 'Cliente actualizado', life: 10000 });
        this.credito = false;
      })
    }
    this.listaClientes = [...this.listaClientes];
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




}

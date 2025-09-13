import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ConfirmationService, MessageService } from "primeng/api";
import { CatalogoService } from "src/app/shared/service/catalogo.service";
import { ProductoService } from "src/app/shared/service/producto.service";
import { UsuarioService } from "../../service/usuario.service";
import { TokenService } from "src/app/shared/service/token.service";
import { ClienteService } from "../../service/cliente.service";
import { TcRegimenFiscal } from "src/app/productos/model/TcRegimenFiscal";
import { Clientes } from "../../interfaces/clientes";
import { TcCp } from "src/app/productos/model/TcCp";
import { validators } from "src/app/shared/validators/validators";
import { DatosFacturaDto } from "../../../productos/model/DatosFacturaDto";
import { ModeActionOnModel } from "src/app/shared/utils/model-action-on-model";
import { ModelContainer } from "src/app/shared/utils/model-container";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { ClienteDireccionesComponent } from "../cliente-direcciones/cliente-direcciones.component";
import { ClienteDireccionEnvio } from "../../model/ClienteDireccionEnvio";
import { FormDireccionClienteComponent } from "../form-direccion-cliente/form-direccion-cliente.component";
import { set } from "date-fns";
import Decimal from "decimal.js";

@Component({
  selector: "app-form-cliente",
  templateUrl: "./form-cliente.component.html",
  styleUrls: ["./form-cliente.component.scss"],
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
  tcCp: TcCp;
  cpExiste: boolean;
  banGuardar: boolean;
  listaDatosFactura: DatosFacturaDto[];
  ref!: DynamicDialogRef;
  clienteDireccionEnvio: ClienteDireccionEnvio;
  banBtnDireccion: boolean;

  constructor(
    private catalogoService: CatalogoService,

    private messageService: MessageService,

    private tokenService: TokenService,

    private clienteService: ClienteService,
    private fb: FormBuilder,
    private _dialogService: DialogService
  ) {
    this.crearFormulario();
    this.listaRegimenFiscal = [];
    this.limpiarFormulario();
    this.cpExiste = false;
    this.banGuardar = false;
    this.banBtnDireccion = false;
    this.cliente = new Clientes();
    this.clienteDireccionEnvio = new ClienteDireccionEnvio();
  }

  ngOnInit(): void {
    /*Se obtiene el catalogo de regimen fiscal para el formulario*/
    this.obtenerRegimenFiscal();
    /*Se crea el formulario*/
    this.crearFormulario();
    /*Se limpia el formulario*/
    this.limpiarFormulario();
    /*Se consulta el catalogo de Razon social */
    this.obtenerCatalogoRazonSocial();
    /*Se determina si en una actualización o un registro nuevo de cliente*/

    if (this.objCliente == undefined) {
      //console.log('Es un nuevo registro');
    } else {
      //console.log('Voy a editar el archivo')
      this.editar();
      this.banBtnDireccion = true;
    }
  }
  crearFormulario() {
    this.formulario = this.fb.group({
      nId: ["", []],
      sRfc: [
        "",
        [
          Validators.required,
          Validators.minLength(12),
          Validators.maxLength(14),
        ],
      ],
      sRazonSocial: ["", [Validators.required]],
      sDireccion: ["", [Validators.required]],
      sTelefono: [
        "",
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      sCorreo: ["", [Validators.required, Validators.email]],
      nCp: [
        "",
        [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(5),
          Validators.pattern("^[0-9]{5}"),
        ],
      ],
      sClave: ["", []],
      nIdRegimenFiscal: ["", [Validators.required]],
      nDatosValidados: ["", []],
      nIdDatoFactura: ["", [Validators.required]],
    });
  }
  // Validación de campos Guardar Cliente
  get validaRfc() {
    return (
      this.formulario.get("sRfc").invalid &&
      this.formulario.get("sRazonSocial").touched
    );
  }
  get validaRS() {
    return (
      this.formulario.get("sRazonSocial").invalid &&
      this.formulario.get("sRazonSocial").touched
    );
  }
  get validaDireccion() {
    return (
      this.formulario.get("sDireccion").invalid &&
      this.formulario.get("sDireccion").touched
    );
  }
  get validaTelefono() {
    return (
      this.formulario.get("sTelefono").invalid &&
      this.formulario.get("sTelefono").touched
    );
  }
  get validaCorreo() {
    return (
      this.formulario.get("sCorreo").invalid &&
      this.formulario.get("sCorreo").touched
    );
  }
  get validaCp() {
    return (
      (this.formulario.get("nCp").invalid &&
        this.formulario.get("nCp").touched) ||
      this.cpExiste
    );
  }
  get validaRegimenfiscal() {
    return (
      this.formulario.get("nIdRegimenFiscal").invalid &&
      this.formulario.get("nIdRegimenFiscal").touched
    );
  }
  get validaValidados() {
    return (
      this.formulario.get("nDatosValidados").invalid &&
      this.formulario.get("nDatosValidados").touched
    );
  }
  get validaDatoFactura() {
    return (
      this.formulario.get("nIdDatoFactura").invalid &&
      this.formulario.get("nIdDatoFactura").touched
    );
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
    this.fclientes.nDatosValidados.setValue(false);
    this.tcCp = null;
  }

  consultaCp() {
    this.tcCp = new TcCp();
    this.catalogoService
      .obtenerCpLike(this.fclientes.nCp.value)
      .subscribe((data) => {
        this.tcCp = data;

        if (this.tcCp != undefined || this.tcCp != null) {
          // console.log('encontre los datos del cogigo postal')
          this.cpExiste = false;
          this.banGuardar = true;
        } else {
          // console.log('No encontre los datos del codigo postal')
          this.formulario.setErrors({ formularioInvalido: true });
          this.cpExiste = true;
          this.banGuardar = false;
        }
      });
  }

  obtenerRegimenFiscal() {
    this.clienteService.obtenerRegimenFiscal().subscribe((data) => {
      this.listaRegimenFiscal = data;
    });
  }

  obtenerCatalogoRazonSocial() {
    this.clienteService.obtenerCatalogoRazonSocial().subscribe((data) => {
      this.listaDatosFactura = data;
    });
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
    this.fclientes.nCp.setValue(this.objCliente.tcCp.sCp);
    this.fclientes.nDatosValidados.setValue(this.objCliente.nDatosValidados);
    // console.log(this.objCliente.nDatosValidados);

    if (
      this.objCliente.tcRegimenFiscal !== null &&
      this.objCliente.tcRegimenFiscal !== undefined
    ) {
      this.consultaCp();
      this.fclientes.nIdRegimenFiscal.setValue(
        this.objCliente.tcRegimenFiscal.nId
      );
      this.fclientes.nIdDatoFactura.setValue(this.objCliente.nIdDatoFactura);
    }
  }

  get fclientes() {
    return this.formulario.controls;
  }

  hideDialog() {
    this.clienteDialog = false;
    this.credito = false;
    this.submitted = false;
    this.limpiarFormulario();
    this.cerrar.emit(true);
  }

  guardar() {
  if (this.formulario.invalid || this.cpExiste) {
    return Object.values(this.formulario.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((c) => c.markAsTouched());
      } else {
        control.markAsTouched();
      }
    });
  }

  this.cliente = this.formulario.value;
  this.cliente.nEstatus = 1;
  this.cliente.nDescuento = this.objCliente?.nDescuento ?? 0;
  this.cliente.n_limiteCredito = this.objCliente?.n_limiteCredito ?? new Decimal(0);
  this.cliente.nCp = this.tcCp?.nId;                 // asegúrate de tener tcCp
  if (!this.cliente.sClave) this.cliente.sClave = this.crearId();

  if (this.cliente.nId) {
    // ------- ACTUALIZACIÓN -------
    this.clienteService.guardaCliente(this.cliente).subscribe((respuesta) => {
      this.listaClientes[this.findIndexById(respuesta.nId.toString())] = respuesta;
      this.messageService.add({ severity: 'success', summary: 'OK', detail: 'Cliente actualizado', life: 10000 });
      this.listaClientes = [...this.listaClientes];
      this.cerrar.emit(true);
    });
  } else {
    // ------- CREACIÓN -------
    this.clienteService.guardaCliente(this.cliente).subscribe((clienteGuardado) => {
      if (!clienteGuardado || !clienteGuardado.nId) {
        this.messageService.add({
          severity: 'error',
          summary: 'Sin ID',
          detail: 'No se pudo obtener el ID del cliente guardado.',
          life: 7000
        });
        return;
      }

      // Mantén tu lista sincronizada
      this.listaClientes.push(clienteGuardado);
      this.listaClientes = [...this.listaClientes];

      this.messageService.add({
        severity: 'success',
        summary: 'Se realizó con éxito',
        detail: 'Cliente guardado',
        life: 10000
      });

      // 2) Ahora sí, abre el modal de direcciones con un cliente válido
      this.openDialogAddDirecciones(clienteGuardado);

      // 3) (Opcional) Cerrar este formulario después de abrir el modal de direcciones
      // this.cerrar.emit(true);
      //    Si prefieres cerrar hasta que cierren el modal de direcciones:
      this.ref?.onClose?.subscribe(() => this.cerrar.emit(true));

      // 4) Limpia de forma segura (evita asignar {} a objetos tipados)
      this.formulario.reset();
      this.cliente = new Clientes();
    });
  }
}

  consultaRfc() {
    if (this.fclientes.sRfc.value.length >= 5) {
      this.clienteService
        .consultaClienteRfc(this.fclientes.sRfc.value)
        .subscribe((data) => {
          if (data !== null) {
            //console.log('entre a asignar los valores para editar')
            this.objCliente = data;
            this.editar();
          } else {
            this.objCliente = {};
          }
        });
    }
  }

  guardarLineaCredito() {
    if (this.cliente.nId) {
      this.cliente.nEstatus = 1;
      this.cliente.n_idUsuarioCredito = this.tokenService.getIdUser();
      this.clienteService.guardaCliente(this.cliente).subscribe((respuesta) => {
        this.listaClientes[this.findIndexById(respuesta.nId.toString())] =
          respuesta;
        this.messageService.add({
          severity: "success",
          summary: "Se realizó con éxito",
          detail: "Cliente actualizado",
          life: 10000,
        });
        this.credito = false;
      });
    }
    this.listaClientes = [...this.listaClientes];
  }

  openDialogAddDirecciones(cliente : Clientes) {
    console.log('cliente para openAdd',cliente);
    this.clienteDireccionEnvio.nIdCliente = cliente.nId;
    const mode =
      this.clienteDireccionEnvio.nId !== null
        ? ModeActionOnModel.EDITING
        : ModeActionOnModel.CREATING;
    const data = new ModelContainer(mode, this.clienteDireccionEnvio);

    this.ref = this._dialogService.open(FormDireccionClienteComponent, {
      data: data,
      header: "Direcciones de envío",
      width: "70%",
      height: "60%",
    });
  }

  openDialogGetDirecciones() {
    this.clienteDireccionEnvio.nIdCliente = this.objCliente.nId;
    const mode =ModeActionOnModel.WATCHING;
    const data = new ModelContainer(mode, this.clienteDireccionEnvio);

    this.ref = this._dialogService.open(ClienteDireccionesComponent, {
      data: data,
      header: "Direcciones de envío",
      width: "90%",
      height: "60%",
    });
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
    let id = "";
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
}

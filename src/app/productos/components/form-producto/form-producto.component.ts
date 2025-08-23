import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { TcProducto } from '../../model/TcProducto';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TokenService } from 'src/app/shared/service/token.service';
import { CatalogoService } from 'src/app/shared/service/catalogo.service';
import { TcCategoriaGeneral } from '../../model/TcCategoriaGeneral';
import { TcCategoria } from '../../model/TcCategoria';
import { TcClavesat } from '../../model/TcClavesat';
import { TcGanancia } from '../../model/TcGanancia';
import { forkJoin } from 'rxjs';
import { TcMarca } from '../../model/TcMarca';
import Decimal from 'decimal.js';
import { TcMoneda } from '../../model/TcMoneda';
import { ProductoService } from 'src/app/shared/service/producto.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { PartService } from 'src/app/shared/service/part.service';
import { PartResponse } from '../../model/PartResponse ';
import { producto } from '../../interfaces/producto.interfaces';

const minIfPresent = (min: number): ValidatorFn => (c: AbstractControl): ValidationErrors | null => {
  const v = c.value;
  if (v === null || v === '' || v === undefined) return null; // sin valor => OK
  return (+v >= min) ? null : { min: { min, actual: +v } };
};

/** Para campos NO obligatorios: valida min SOLO si v > 0. 0 o vacío NO invalidan. */
const minIfPositive = (min: number): ValidatorFn => (c: AbstractControl): ValidationErrors | null => {
  const v = c.value;
  if (v === null || v === '' || v === undefined) return null;
  if (+v === 0) return null;
  return (+v >= min) ? null : { min: { min, actual: +v } };
};

@Component({
  selector: 'app-form-producto',
  templateUrl: './form-producto.component.html',
  styleUrls: ['./form-producto.component.scss']
})
export class FormProductoComponent implements OnInit {

  modelContainer: ModelContainer;
  producto: TcProducto = new TcProducto();
  formGrp: FormGroup;
  listaCategoriaGeneral: TcCategoriaGeneral[] = [];
  listaCategoria: TcCategoria[] = [];
  listaClaveSat: TcClavesat[] = [];
  listaGanancia: TcGanancia[] = [];
  listaMarca: TcMarca[] = [];
  listaMoneda: TcMoneda[] = [];
  precioFinal: number = 0;
  tcProducto: TcProducto = new TcProducto();
  modo: string = '';
  rol: string = '';
  realRol: string = '';
  guardando: boolean = false;
  productoProveedor: PartResponse;

  noParte: string;
  nIdMarca: number;



  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private tokenService: TokenService,
    private catalogoService: CatalogoService,
    private productosService: ProductoService,
    private messageService: MessageService,
    private partService: PartService,
    private confirmationService: ConfirmationService

  ) {

    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
    this.noParte = '';
    this.nIdMarca = 0;
  }

  ngOnInit(): void {
    const modelContainer: ModelContainer = this.config.data;

    /*Asigna el valor a producto */
    this.producto = ObjectUtils.isEmpty(modelContainer.modelData) ? new TcProducto() : modelContainer.modelData as TcProducto;
    console.log('Este es el producto que llego', this.producto);

    /* obtiene el modo */
    this.modo = modelContainer.modeAction;
    /* obtiene el rol principal */
    const roles: string[] = this.tokenService.getRoles(); // o como los obtengas
    this.realRol = this.calcularRolPrincipal(roles);
    const isEdit = this.modo === ModeActionOnModel.EDITING;

    this.crearFormulario();

    this.suscribirCambiosPrecio();
    this.suscribirCalculoVolumen();

    this.formGrp.get('nIdCategoriaGeneral')?.valueChanges.subscribe(id => {
      this.obtenerCategoria(id);
    });

    const observable1 = this.catalogoService.obtenerCategoriaGeneral();
    const observable2 = this.catalogoService.obtenerClaveSat();
    const observable3 = this.catalogoService.obtenerGanancia();
    const observable4 = this.catalogoService.obtenerMarcas();
    const observable5 = this.tokenService.getIdUser(); // no se usa, puedes removerlo
    const observable6 = this.catalogoService.obtenerMonedas();


    forkJoin([observable1, observable2, observable3, observable4, observable6]).subscribe({
      next: ([resultado1, resultado2, resultado3, resultado4, resultado6]) => {
        this.listaCategoriaGeneral = resultado1;
        this.listaClaveSat = resultado2;
        this.listaGanancia = resultado3;
        this.listaMarca = resultado4;
        this.listaMoneda = resultado6;

        // 👉 Ya que los catálogos están cargados, se puede llenar el formulario
        if (this.modo === ModeActionOnModel.EDITING) {
          this.setFormValuesFromProducto();
          // También habilitamos categoría si ya hay valor
          if (this.producto.nIdCategoriaGeneral) {
            this.obtenerCategoria(this.producto.nIdCategoriaGeneral);
          }
        }

        // Si es un producto nuevo
        if (!this.producto?.nId || !this.producto?.sIdBar) {
          this.generarCodigoBarrasUnico();
        }
      },
      error: error => {
        console.error('Error al ejecutar los observables', error);
      }
    });
  }

  obtenerCategoria(idCategoriaGeneral: number): void {
    if (!idCategoriaGeneral) {
      this.formGrp.get('nIdCategoria')?.setValue(null);
      this.formGrp.get('nIdCategoria')?.disable();
      this.listaCategoria = [];
      return;
    }

    this.catalogoService.obtenerCategoria(idCategoriaGeneral).subscribe(categorias => {
      this.listaCategoria = categorias;
      const ctrl = this.formGrp.get('nIdCategoria');
      ctrl?.enable();
      ctrl?.updateValueAndValidity(); // 👈 importante
    });
  }

  private calcularRolPrincipal(roles: string[]): string {
    const prioridadRoles: { [key: string]: string } = {
      'ROLE_ADMIN': 'admin',
      'ROLE_VENTA': 'ventas',
      'ROLE_DISTRIBUIDOR': 'distribuidor',
      'ROLE_ALMACEN': 'almacen',
      'ROLE_CAJA': 'caja'
    };

    const jerarquia = ['ROLE_ADMIN', 'ROLE_VENTA', 'ROLE_DISTRIBUIDOR', 'ROLE_ALMACEN', 'ROLE_CAJA'];

    for (const rol of jerarquia) {
      if (roles.includes(rol)) {
        return prioridadRoles[rol];
      }
    }

    return 'desconocido'; // por si no hay roles válidos
  }

  verificarProducto(): void {
    this.noParte = this.formGrp.get('sNoParte')?.value;
    this.nIdMarca = this.formGrp.get('nIdMarca')?.value;

    this.productosService.getProductoByNoParteAndIdMarca(this.noParte, this.nIdMarca).subscribe({
      next: (producto) => {
        console.log('Producto encontrado:', producto);
        if (producto) {

          this.producto = producto;
          this.setFormValuesFromProducto();
          this.formGrp.get('nIdMarca')?.setValue(this.nIdMarca);
          setTimeout(() => {
            this.asignarMarca();
          }, 1000);

          if (producto.nLargo == null && producto.nAncho == null && producto.nAlto == null) {
            this.consultarProductoProveedor();
          }
        } else {
          this.consultarProductoProveedor();
          this.formGrp.get('nIdMarca')?.setValue(this.nIdMarca);
          setTimeout(() => {
            this.asignarMarca();
          }, 1000);

        }



      },
      error: (error) => {
        console.error('Error al verificar producto', error);
      }
    });
  }


  /*ASIGNA LA MARCA AL CAMPO DE SMARCA */

  asignarMarca(): void {
    console.log('Asignando marca para nIdMarca:', this.nIdMarca);
    console.log('Lista de marcas disponible:', this.listaMarca);
    const marcaSeleccionada = this.listaMarca.find(m => m.nId === this.nIdMarca);
    console.log('Marca seleccionada:', marcaSeleccionada);
    if (marcaSeleccionada) {
      this.formGrp.get('sMarca')?.setValue(marcaSeleccionada.sMarca);
    } else {
      this.formGrp.get('sMarca')?.setValue('');
    }
  }


  guardarProducto(): void {
    if (this.formGrp.invalid) {
      Object.values(this.formGrp.controls).forEach(control => {
        if (control instanceof FormGroup) {
          Object.values(control.controls).forEach(c => c.markAsTouched());
        } else {
          control.markAsTouched();
        }
      });
      return;
    }

    this.setManualProductoFromForm();
    this.guardando = true;
    console.log('Producto a guardar:', this.tcProducto);
    this.productosService.guardaProducto(this.tcProducto).subscribe({
      next: (productoActualizado) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Producto guardado',
          detail: 'Producto guardado correctamente',
          life: 3000
        });

        this.ref.close(productoActualizado); // ✅ Devuelve al padre
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el producto',
          life: 3000
        });
        this.guardando = false; // 🔓 Reactiva en error
      },
      complete: () => {
        this.guardando = false; // 🔓 Reactiva después de éxito
      }
    });
  }


  /*convierte a mayuscuelas */
  forzarMayusculas(campo: string): void {
    const control = this.formGrp.get(campo);
    if (control && control.value) {
      control.setValue(control.value.toUpperCase(), { emitEvent: false });
    }
  }



  /*llena los campos para la edicion */

  private setFormValuesFromProducto(): void {
    this.formGrp.patchValue({
      sNoParte: this.producto.sNoParte ?? '',
      sProducto: this.producto.sProducto ?? '',
      sDescripcion: this.producto.sDescripcion ?? '',
      sMarca: this.producto.sMarca ?? '',
      nIdCategoria: this.producto.nIdCategoria ?? null,
      nIdCategoriaGeneral: this.producto.nIdCategoriaGeneral ?? null,
      nPrecio: this.producto.nPrecio ?? '',
      sMoneda: this.producto.sMoneda ?? '',
      nIdGanancia: this.producto.nIdGanancia ?? null,
      nIdclavesat: this.producto.nIdclavesat ?? null,
      sIdBar: this.producto.sIdBar ?? '',
      nIdDescuento: this.producto.nIdDescuento ?? null,
      nIdMarca: this.producto.nIdMarca ?? null,
      nPeso: this.producto.nPeso ?? null,
      nLargo: this.producto.nLargo ?? null,
      nAlto: this.producto.nAlto ?? null,
      nAncho: this.producto.nAncho ?? null,
      nVolumen: this.producto.nVolumen ?? null,
      sRutaImagen: this.producto.sRutaImagen ?? ''
    });

    if (this.producto?.sRutaImagen) {

      this.productosService.getImegenProducto(this.producto.sRutaImagen).subscribe({
        next: (data) => {
          this.formGrp.patchValue({ sRutaImagen: data?.imagenBase64 || '' });
          this.formGrp.get('sRutaImagen')?.updateValueAndValidity(); // 👈
        },
        error: (err) => {
          this.formGrp.patchValue({ sRutaImagen: '' });
          this.formGrp.get('sRutaImagen')?.updateValueAndValidity(); // 👈
        }
      });

    }

    // ✅ Normaliza 0 → null si el campo es opcional para el rol
    this.normalizaDimensionesParaRol();

    // 👇 Fuerza el cálculo del precio (en almacén los campos están deshabilitados)
    this.calculaPrecioFinal(true);


    //Opcionalmente deshabilitar campos si es edición
    this.formGrp.get('sNoParte')?.disable();
    this.formGrp.get('sMarca')?.disable();

  }

  consultarProductoProveedor() {
    const numeroParte = this.formGrp.get('sNoParte')?.value;

    if (!numeroParte) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Número de parte requerido',
        detail: 'Por favor ingresa un número de parte válido.',
        life: 3000
      });
      return;
    }

    this.partService.obtenerProductoCostex(numeroParte, '1').subscribe({
      next: (part) => {
        if (part) {
          // Mostrar confirmación antes de cargar al formulario
          const factorPulgadasACm = new Decimal(2.54);
          const redondear = (valor: Decimal) => valor.toDecimalPlaces(2);

          const largoCm = part.dblLengthIn ? redondear(new Decimal(part.dblLengthIn).mul(factorPulgadasACm)) : null;
          const anchoCm = part.dblWidthIn ? redondear(new Decimal(part.dblWidthIn).mul(factorPulgadasACm)) : null;
          const altoCm = part.dblHeightIn ? redondear(new Decimal(part.dblHeightIn).mul(factorPulgadasACm)) : null;



          this.confirmationService.confirm({
            message: 'Se encontró información del proveedor. ¿Deseas cargar estos datos al formulario?',
            header: 'Confirmar carga de datos',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
              this.productoProveedor = part;

              if (this.producto !== null) {
                this.formGrp.patchValue({
                  nPeso: part.dblWeigthKgs,
                  nLargo: largoCm?.toNumber(),
                  nAncho: anchoCm?.toNumber(),
                  nAlto: altoCm?.toNumber(),
                  // Agrega más campos si es necesario
                });

              } else {
                this.formGrp.patchValue({
                  sProducto: part.strDescrip1,
                  sDescripcion: part.strDescrip1,
                  nPeso: part.dblWeigthKgs,
                  nLargo: largoCm?.toNumber(),
                  nAncho: anchoCm?.toNumber(),
                  nAlto: altoCm?.toNumber(),
                  // Agrega más campos si es necesario
                });
              }


              this.messageService.add({
                severity: 'success',
                summary: 'Datos cargados',
                detail: 'Los datos del proveedor fueron aplicados al formulario.',
                life: 3000
              });
            },
            reject: () => {
              this.messageService.add({
                severity: 'info',
                summary: 'Carga cancelada',
                detail: 'No se modificó el formulario.',
                life: 3000
              });
            }
          });
        } else {
          this.messageService.add({
            severity: 'info',
            summary: 'Producto no encontrado',
            detail: `No se encontró información para la clave ${numeroParte}`,
            life: 3000
          });
        }
      },
      error: (err) => {
        console.error('❌ Error al consultar producto COSTEX:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error de servicio',
          detail: 'Ocurrió un error al obtener el producto.',
          life: 3000
        });
      }
    });
  }







  /*setea los valores del formulario*/

  private setManualProductoFromForm(): void {

    const form = this.formGrp;

    this.tcProducto.sNoParte = form.get('sNoParte')?.value;
    this.tcProducto.sProducto = form.get('sProducto')?.value;
    this.tcProducto.sDescripcion = form.get('sDescripcion')?.value;
    this.tcProducto.sMarca = form.get('sMarca')?.value;
    this.tcProducto.nIdCategoria = form.get('nIdCategoria')?.value;
    this.tcProducto.nIdCategoriaGeneral = form.get('nIdCategoriaGeneral')?.value;
    this.tcProducto.nPrecio = form.get('nPrecio')?.value;
    this.tcProducto.sMoneda = form.get('sMoneda')?.value;
    this.tcProducto.nIdGanancia = form.get('nIdGanancia')?.value;
    this.tcProducto.nIdclavesat = form.get('nIdclavesat')?.value;
    this.tcProducto.sIdBar = form.get('sIdBar')?.value || ''; // en caso de que no se genere
    this.tcProducto.nIdDescuento = form.get('nIdDescuento')?.value;
    this.tcProducto.nIdMarca = form.get('nIdMarca')?.value;
    this.tcProducto.nPeso = form.get('nPeso')?.value ?? 0;
    this.tcProducto.nLargo = form.get('nLargo')?.value ?? 0;
    this.tcProducto.nAlto = form.get('nAlto')?.value ?? 0;
    this.tcProducto.nAncho = form.get('nAncho')?.value ?? 0;
    this.tcProducto.nVolumen = form.get('nVolumen')?.value ?? 0;
    this.tcProducto.sRutaImagen = form.get('sRutaImagen')?.value || null;

    if (this.modo === ModeActionOnModel.EDITING && this.producto?.nId) {
      this.tcProducto.nId = this.producto.nId;
    }
    //asigna el valor del id si el numero de parte ya existe
    if (this.producto?.nId && this.modo === ModeActionOnModel.CREATING) {
      this.tcProducto.nId = this.producto.nId;
    }

    this.tcProducto.nEstatus = 1;
    this.tcProducto.nIdusuario = this.tokenService.getIdUser();
  }




  crearFormulario(): void {
    const isEdit = this.modo === ModeActionOnModel.EDITING;

    const camposDeshabilitados = this.obtenerCamposDeshabilitados(isEdit, this.realRol);
    const camposObligatorios = this.obtenerCamposObligatorios(this.realRol);

    const createControl = (nombre: string, valorInicial: any = '', validadores: any[] = []) => {
      const deshabilitado = camposDeshabilitados.includes(nombre);
      return new FormControl({ value: valorInicial, disabled: deshabilitado }, validadores);
    };

    this.formGrp = new FormGroup({
      sNoParte: createControl('sNoParte', '', camposObligatorios.includes('sNoParte') ? [Validators.required] : []),
      sProducto: createControl('sProducto', '', [Validators.required]),
      sDescripcion: createControl('sDescripcion', '', [Validators.required]),
      sMarca: createControl('sMarca', '', camposObligatorios.includes('sMarca') ? [Validators.required] : []),
      nIdCategoria: createControl('nIdCategoria', '', [Validators.required]),
      nIdCategoriaGeneral: createControl('nIdCategoriaGeneral', null, [Validators.required]),
      nPrecio: createControl('nPrecio', '', camposObligatorios.includes('nPrecio') ? [Validators.required] : []),
      sMoneda: createControl('sMoneda', '', camposObligatorios.includes('sMoneda') ? [Validators.required] : []),
      nIdGanancia: createControl('nIdGanancia', null, camposObligatorios.includes('nIdGanancia') ? [Validators.required] : []),
      nIdclavesat: createControl('nIdclavesat', null, [Validators.required]),
      sIdBar: createControl('sIdBar', '', [Validators.required]),
      nIdDescuento: createControl('nIdDescuento', null, camposObligatorios.includes('nIdDescuento') ? [Validators.required] : []),
      nIdMarca: createControl('nIdMarca', null, camposObligatorios.includes('nIdMarca') ? [Validators.required] : []),
      nPeso: createControl('nPeso', null,
        camposObligatorios.includes('nPeso') ? [Validators.required, minIfPresent(0.01)] : [minIfPositive(0.01)]
      ),
      nLargo: createControl('nLargo', null,
        camposObligatorios.includes('nLargo') ? [Validators.required, minIfPresent(0.01)] : [minIfPositive(0.01)]
      ),
      nAlto: createControl('nAlto', null,
        camposObligatorios.includes('nAlto') ? [Validators.required, minIfPresent(0.01)] : [minIfPositive(0.01)]
      ),
      nAncho: createControl('nAncho', null,
        camposObligatorios.includes('nAncho') ? [Validators.required, minIfPresent(0.01)] : [minIfPositive(0.01)]
      ),
      nVolumen: createControl('nVolumen', null,
        camposObligatorios.includes('nVolumen') ? [Validators.required, minIfPresent(0.01)] : [minIfPositive(0.01)]
      ),
      sRutaImagen: createControl('sRutaImagen', '', camposObligatorios.includes('sRutaImagen') ? [Validators.required] : [])
    });
  }

  /*OBTIENE LOS CAMPOS DESHABILITADOS */
  obtenerCamposDeshabilitados(isEdit: boolean, rol: string): string[] {
    const comunesEdit = ['sNoParte', 'sMarca', 'nIdMarca'];
    const soloAlmacen = ['nPrecio', 'nIdGanancia', 'sMoneda', 'nIdDescuento'];

    let deshabilitados = isEdit ? [...comunesEdit] : [];

    // Siempre deshabilitar categoría al inicio en modo creación (CREATING)
    if (!isEdit) {
      deshabilitados.push('nIdCategoria');
    }

    if (rol === 'almacen') {
      deshabilitados.push(...soloAlmacen);
    }

    return deshabilitados;
  }


  /*OBTIENE LOS CAMPOS OBLIGATORIOS DEL FORMULARIO */

  obtenerCamposObligatorios(rol: string): string[] {
    const base = ['sNoParte', 'sProducto', 'sDescripcion', 'sMarca', 'nIdCategoria', 'nIdCategoriaGeneral', 'nIdclavesat', 'sIdBar', 'nIdMarca'];

    switch (rol) {
      case 'admin':
        return [...base, 'nPrecio', 'sMoneda', 'nIdGanancia', 'nIdDescuento'];
      case 'ventas':
        return [...base, 'nPrecio', 'sMoneda', 'nIdGanancia', 'nIdDescuento'];
      case 'almacen':
        return [...base, 'nLargo', 'nAlto', 'nAncho', 'nVolumen', 'sRutaImagen'];
      default:
        return base;
    }
  }



  /*CALCULA EL PRECIO FINAL DEL PRODUCTO */

  calculaPrecioFinal(force = false): void {

    // sincroniza tcProducto con el formulario actual
    this.setManualProductoFromForm();

    const precio = this.formGrp.get('nPrecio')?.value;
    const moneda = this.formGrp.get('sMoneda')?.value;
    const ganancia = this.formGrp.get('nIdGanancia')?.value;

    // Si están deshabilitados (rol almacén), permite forzar el cálculo al cargar
    if (!force && (precio == null || moneda == null || ganancia == null)) {
      return;
    }

    const productoCalculo: TcProducto = this.tcProducto;
    this.productosService.simuladorPrecioProducto(productoCalculo).subscribe({
      next: (resp: TcProducto) => {
        this.tcProducto = resp;
        this.precioFinal = new Decimal(resp.nPrecioConIva ?? 0).toDecimalPlaces(2).toNumber();
      },
      error: err => console.error('Error al calcular el precio final:', err)
    });
  }

  /*DETECTA EL CAMBIO DE VALOR PARA CALCULO DE PRECIO DEL PRODUCTO */
  private suscribirCambiosPrecio(): void {
    const precioCtrl = this.formGrp.get('nPrecio');
    const monedaCtrl = this.formGrp.get('sMoneda');
    const gananciaCtrl = this.formGrp.get('nIdGanancia');
    precioCtrl?.valueChanges.subscribe(() => this.calculaPrecioFinal());
    monedaCtrl?.valueChanges.subscribe(() => this.calculaPrecioFinal());
    gananciaCtrl?.valueChanges.subscribe(() => this.calculaPrecioFinal());
  }


  /*CALCULA EL VOLUMEN DEL PRODUCTO POR UNIDAD */
  calcularVolumen(): void {
    const largo = this.formGrp.get('nLargo')?.value;
    const alto = this.formGrp.get('nAlto')?.value;
    const ancho = this.formGrp.get('nAncho')?.value;

    const esValido = [largo, alto, ancho].every(v => v != null && v > 0);

    if (esValido) {
      const volumen = new Decimal(largo).mul(alto).mul(ancho);
      this.formGrp.get('nVolumen')?.setValue(volumen.toDecimalPlaces(2).toNumber());
    } else {
      // Si no hay datos válidos, deja volumen en blanco (no error)
      this.formGrp.get('nVolumen')?.setValue(null);
    }
  }

  /*DETECTA EL CAMBIO DE VALORES DE ALTO, ANCHO Y LARGO PARA RE CALCULAR EL VOLUMEN */
  suscribirCalculoVolumen(): void {
    ['nLargo', 'nAlto', 'nAncho'].forEach(campo => {
      this.formGrp.get(campo)?.valueChanges.subscribe(() => this.calcularVolumen());
    });
  }

  /*GENERA EL CODIGO DE BARRAS */
  generarCodigoBarrasUnico(): void {
    const prefijoMexico = '750'; // Prefijo oficial de México (3 dígitos)
    // Obtenemos fecha y hora actual
    const now = new Date();
    // Formato: AAMMDDHHmmss (sin siglo para ahorrar espacio)
    const fechaHora = now.getFullYear().toString().slice(-2) +
      this.padZero(now.getMonth() + 1) +
      this.padZero(now.getDate()) +
      this.padZero(now.getHours()) +
      this.padZero(now.getMinutes()) +
      this.padZero(now.getSeconds());
    // Tomamos los últimos 9 dígitos para combinar con el prefijo 750 (total 12 sin dígito verificador)
    const cuerpo = fechaHora.slice(-9); // Por ejemplo: '250728145' si es 2025-07-28 14:55:30
    const base12 = prefijoMexico + cuerpo; // 12 dígitos
    // Calculamos dígito verificador
    const digitoVerificador = this.calcularDigitoVerificadorEAN13(base12);
    const codigoBarras = base12 + digitoVerificador;
    // Asignamos al campo
    this.formGrp.get('sIdBar')?.setValue(codigoBarras);
  }

  /*FUNCION AUXILIAR QUE AGREGA 0 S  A LA IZQUIERDA */

  padZero(valor: number): string {
    return valor.toString().padStart(2, '0');
  }

  /*CALCULA EL DIGITO VERIFICADOR */
  calcularDigitoVerificadorEAN13(codigo12: string): number {
    const nums = codigo12.split('').map(n => parseInt(n, 10));
    let suma = 0;

    for (let i = 0; i < nums.length; i++) {
      suma += nums[i] * (i % 2 === 0 ? 1 : 3);
    }

    const resto = suma % 10;
    return resto === 0 ? 0 : 10 - resto;
  }


  /*convierte a base64 la imagen */

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      if (file.size > 1024 * 1024) {
        this.messageService.add({
          severity: 'error',
          summary: 'Imagen demasiado grande',
          detail: 'El archivo debe pesar menos de 1MB',
          life: 3000
        });
        this.formGrp.get('sRutaImagen')?.setValue('');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        this.formGrp.get('sRutaImagen')?.setValue(base64);
        this.formGrp.get('sRutaImagen')?.markAsTouched(); // marca para validación visual

      };
      reader.readAsDataURL(file);
    }
  }

  /** ¿Este control es opcional para el rol actual? */
  private esOpcional(ctrlName: string): boolean {
    return !this.obtenerCamposObligatorios(this.realRol).includes(ctrlName);
  }

  /** Si el control es opcional y trae 0, lo convierte a null (no dispara eventos) */
  private zeroToNullIfOptional(ctrlName: string): void {
    const c = this.formGrp.get(ctrlName);
    if (!c) return;

    if (this.esOpcional(ctrlName)) {
      const v = c.value;
      // contempla 0, "0", 0.00, "0.00"
      const esCero = v === 0 || v === '0' || v === 0.0 || v === '0.00' || v === '0.0';
      if (esCero) c.setValue(null, { emitEvent: false });
    }
  }

  /** Aplica normalización a dimensiones/volumen y revalida */
  private normalizaDimensionesParaRol(): void {
    ['nPeso', 'nLargo', 'nAlto', 'nAncho', 'nVolumen']
      .forEach(n => this.zeroToNullIfOptional(n));

    this.formGrp.updateValueAndValidity({ emitEvent: false });
  }








  get validaNoParte() {
    return this.formGrp.get('sNoParte')?.invalid && this.formGrp.get('sNoParte')?.touched;
  }
  get validaProducto() {
    return this.formGrp.get('sProducto')?.invalid && this.formGrp.get('sProducto')?.touched;
  }
  get validaDescripcion() {
    return this.formGrp.get('sDescripcion')?.invalid && this.formGrp.get('sDescripcion')?.touched;
  }
  get validaMarca() {
    return this.formGrp.get('sMarca')?.invalid && this.formGrp.get('sMarca')?.touched;
  }
  get validaCategoria() {
    return this.formGrp.get('nIdCategoria')?.invalid && this.formGrp.get('nIdCategoria')?.touched;
  }
  get validaCategoriaGeneral() {
    return this.formGrp.get('nIdCategoriaGeneral')?.invalid && this.formGrp.get('nIdCategoriaGeneral')?.touched;
  }
  get validaPrecio() {
    return this.formGrp.get('nPrecio')?.invalid && this.formGrp.get('nPrecio')?.touched;
  }
  get validaMoneda() {
    return this.formGrp.get('sMoneda')?.invalid && this.formGrp.get('sMoneda')?.touched;
  }
  get validaGanancia() {
    return this.formGrp.get('nIdGanancia')?.invalid && this.formGrp.get('nIdGanancia')?.touched;
  }
  get validaClaveSat() {
    return this.formGrp.get('nIdclavesat')?.invalid && this.formGrp.get('nIdclavesat')?.touched;
  }
  get validaBar() {
    return this.formGrp.get('sIdBar')?.invalid && this.formGrp.get('sIdBar')?.touched;
  }
  get validaDescuento() {
    return this.formGrp.get('nIdDescuento')?.invalid && this.formGrp.get('nIdDescuento')?.touched;
  }
  get validanIdMarca() {
    return this.formGrp.get('nIdMarca')?.invalid && this.formGrp.get('nIdMarca')?.touched;
  }

  get validaImagen() {
    return this.formGrp.get('sRutaImagen')?.invalid && this.formGrp.get('sRutaImagen')?.touched;
  }






}

import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModeActionOnModel } from 'src/app/shared/utils/model-action-on-model';
import { ModelContainer } from 'src/app/shared/utils/model-container';
import { TcProducto } from '../../model/TcProducto';
import { ObjectUtils } from 'src/app/shared/utils/object-ultis';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { MessageService } from 'primeng/api';

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
  modo:string='';

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private tokenService: TokenService,
    private catalogoService: CatalogoService,
    private productosService: ProductoService,
     private messageService: MessageService,

  ) {
   
    this.modelContainer = new ModelContainer(ModeActionOnModel.WATCHING);
  }

  ngOnInit(): void {
  const modelContainer: ModelContainer = this.config.data;

  this.producto = ObjectUtils.isEmpty(modelContainer.modelData)
    ? new TcProducto()
    : modelContainer.modelData as TcProducto;

  this.modo = modelContainer.modeAction;

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
      if (!this.producto?.nId) {
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
    this.formGrp.get('nIdCategoria')?.enable();
  });
}


  asignarMarca(event: any): void {
    const marcaSeleccionada = this.listaMarca.find(m => m.nId === event.value);
    if (marcaSeleccionada) {
      this.formGrp.get('sMarca')?.setValue(marcaSeleccionada.sMarca);
    } else {
      this.formGrp.get('sMarca')?.setValue('');
    }
  }


  saveProduct() {
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

  console.log('Esto es lo que guardaré', this.tcProducto)

  this.productosService.obtenerProductoNoParte(this.formGrp.get('sNoParte')?.value).subscribe(data => {
    // Aquí va la lógica para guardar el producto
  });
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

  // Opcionalmente deshabilitar campos si es edición
  this.formGrp.get('sNoParte')?.disable();
  this.formGrp.get('sMarca')?.disable();
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
  
  this.tcProducto.nEstatus = 1;
  this.tcProducto.nIdusuario = this.tokenService.getIdUser();
}

 crearFormulario() {
  const isEdit = this.modo === ModeActionOnModel.EDITING;

  this.formGrp = new FormGroup({
    sNoParte: new FormControl({ value: '', disabled: isEdit }, Validators.required),
    sProducto: new FormControl('', Validators.required),
    sDescripcion: new FormControl('', Validators.required),
    sMarca: new FormControl({ value: '', disabled: isEdit }, Validators.required),
    nIdCategoria: new FormControl({ value: '', disabled: true }, Validators.required),
    nIdCategoriaGeneral: new FormControl(null, Validators.required),
    nPrecio: new FormControl('', Validators.required),
    sMoneda: new FormControl('', Validators.required),
    nIdGanancia: new FormControl(null, [Validators.required]),
    nIdclavesat: new FormControl(null, Validators.required),
    sIdBar: new FormControl({ value: '', disabled: true }, [Validators.required]),
    nIdDescuento: new FormControl(null, Validators.required),
    nIdMarca: new FormControl({value:null , disabled: isEdit}, Validators.required),
    nPeso: new FormControl(null, [Validators.min(0.01)]),
    nLargo: new FormControl(null, [Validators.min(0.01)]),
    nAlto: new FormControl(null, [Validators.min(0.01)]),
    nAncho: new FormControl(null, [Validators.min(0.01)]),
    nVolumen: new FormControl({ value: '', disabled: false }, [Validators.min(0.01)]),
    sRutaImagen: new FormControl('', [])
  });
}


 calculaPrecioFinal(): void {
  console.log('entre a calcual el precvio del producto ');
  const precioCtrl = this.formGrp.get('nPrecio');
  const monedaCtrl = this.formGrp.get('sMoneda');
  const gananciaCtrl = this.formGrp.get('nIdGanancia');

  console.log(this.formGrp.get('nPrecio').value);
    console.log(this.formGrp.get('sMoneda').value);
      console.log(this.formGrp.get('nIdGanancia').value);


  if (precioCtrl?.valid && monedaCtrl?.valid && gananciaCtrl?.valid) {
    console.log('entre a consultar el precio');
    const productoCalculo: TcProducto = this.formGrp.getRawValue();
    console.log(productoCalculo);
    this.productosService.simuladorPrecioProducto(productoCalculo).subscribe({
      next: (resp: TcProducto) => {
        this.tcProducto = resp;
       this.precioFinal = new Decimal(resp.nPrecioConIva ?? 0).toDecimalPlaces(2).toNumber();
      },
      error: err => {
        console.error('Error al calcular el precio final:', err);
      }
    });
  }
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
      console.log(base64);
    };
    reader.readAsDataURL(file);
  }
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

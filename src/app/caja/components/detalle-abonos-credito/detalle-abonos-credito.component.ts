import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { TwAbono } from 'src/app/productos/model/TwAbono';
import { TcFormaPago } from '../../../productos/model/TcFormaPago';
import { CatalogoService } from '../../../shared/service/catalogo.service';
import { VentasService } from '../../../shared/service/ventas.service';
import { TwVenta } from '../../../productos/model/TwVenta';
import { TwCaja } from '../../../productos/model/TwCaja';
import { UsuarioService } from '../../../administracion/service/usuario.service';
import { TokenService } from 'src/app/shared/service/token.service';
import { TcUsuario } from '../../../administracion/model/TcUsuario';
import { validators } from '../../../shared/validators/validators';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-detalle-abonos-credito',
  templateUrl: './detalle-abonos-credito.component.html',
  styleUrls: ['./detalle-abonos-credito.component.scss']
})
export class DetalleAbonosCreditoComponent implements OnInit {

  @Input() listaAbonosVenta: TwAbono[];
  @Input() tvVentasDetalle: TvVentasDetalle;

  formulario: FormGroup;
  abrirformulario: boolean;
  listaFormaPago: TcFormaPago[];
  twVenta: TwVenta;
  tcFormaPago: TcFormaPago;
  twCaja: TwCaja;
  tcUsuario: TcUsuario;
  twAbono:TwAbono;

  constructor(private fb: FormBuilder, private catalogo: CatalogoService, private ventasService: VentasService, private catalogoService: CatalogoService, private usuarioService: UsuarioService, private tokenService: TokenService,  private messageService: MessageService) {

    this.listaFormaPago = [];
    this.twVenta = {};
    this.tcFormaPago = {};
    this.twCaja = {};
    this.twAbono={}

  }

  ngOnInit(): void {


    this.crearFormulario();
    console.log(this.tvVentasDetalle)
  }

  crearFormulario() {

    this.formulario = this.fb.group({

      abono: ['', [Validators.required, Validators.pattern(validators.numero)]],
      idFormaPago: ['', [Validators.required]],


    })

  }
  cerrarModal() {
    this.abrirformulario = false;

    this.limpiaFormulario();

  }

  limpiaFormulario() {
    this.fProducto.abono.setValue("");
    this.fProducto.idFormaPago.setValue("");


  }

  guardarAbono() {

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
      /*Llenado de objeto venta */

      let res1, res2, res3, res4;

      if(this.formulario.get('abono').value < this.tvVentasDetalle.nSaldoTotal){
             res1 = this.ventasService.obtnerVentaId(this.tvVentasDetalle.nId)

     

         /*Llenado de forma pago*/
       res2 = this.catalogoService.obtenerFormaPagoId(this.formulario.get('idFormaPago').value)
   
         /*Llenado de objeto caja */
       res3 = this.catalogoService.obtenerCajaActiva()
        

         /*Llenado de objeto user */
        
         if (this.tokenService.getIdUser() > 0) {
         res4 = this.usuarioService.getUsuariosId(this.tokenService.getIdUser())
        
      }


      forkJoin([res1,res2,res3, res4]).subscribe(data=>{
        let bandera:boolean;
 
        this.twAbono.twVenta=data[0];
         this.twAbono.tcFormapago=data[1];
         this.twAbono.twCaja=data[2];
         this.twAbono.tcUsuario=data[3];
           this.twAbono.nAbono=this.formulario.get('abono').value;
         this.twAbono.nEstatus=1;
         this.twAbono.nIdVenta=this.tvVentasDetalle.nId;
         this.twAbono.nId=null;
         this.twAbono.dFecha=null;
         console.log("Este es el objeto lleno");
         console.log(this.twAbono);
 
         if(this.twAbono.twVenta!==null && this.twAbono.tcFormapago!==null && this.twAbono.twCaja.nId!==null &&  this.twAbono.tcUsuario!==null){
         this.ventasService.guardaAbono(this.twAbono).subscribe(data =>{
         this.listaAbonosVenta.push(data);
           this.abrirformulario=false;
           this.messageService.add({ severity: 'success', summary: 'Abono Guardado', detail: 'El Abono se guardo', life: 3000 });
           this.listaAbonosVenta = [...this.listaAbonosVenta];
 
           this.tvVentasDetalle.nSaldoTotal-=this.twAbono.nAbono;
         
 
           this.limpiaFormulario();
     
         });
       
       }
 
       });
    }
    else{
      this.messageService.add({ severity: 'error', summary: 'Error Abono', detail: 'El monto no puede ser mayor a la deuda total', life: 3000 });

    }
      

   


   




    }


  }

  get validaAbono() {
    return this.formulario.get('abono').invalid && this.formulario.get('abono').touched;
  }
  get validaFormaPago() {
    return this.formulario.get('idFormaPago').invalid && this.formulario.get('idFormaPago').touched;
  }

  get fProducto() {
    return this.formulario.controls;
  }

  hideDialog2() {

    this.abrirformulario = true;
    this.catalogo.obtenerFormaPago().subscribe(data => {
      this.listaFormaPago = data;
    })

  }
}
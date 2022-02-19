import { VentaProductoDto } from './../../../ventasycotizaciones/model/dto/VentaProductoDto';
import { CatalogoService } from './../../../shared/service/catalogo.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TcFormaPago } from 'src/app/productos/model/TcFormaPago';
import { TvVentasDetalle } from 'src/app/productos/model/TvVentasDetalle';
import { VentasService } from 'src/app/shared/service/ventas.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.component.html',
  styleUrls: ['./cobrar.component.scss']
})
export class CobrarComponent implements OnInit {
 
    titulo:string;
 


/*objetos definitivos  */
  listaVentasDetalleCliente: TvVentasDetalle[];
  mostrarProductos:boolean;
  listaProductosVenta:VentaProductoDto;
  abrirformulario: boolean;
  VentaDescuentoDto:TvVentasDetalle;
  formulario: FormGroup;
  cols: any[];
  listaFormaPago: TcFormaPago[];
  noVenta:number;
  totalVenta:number;


  constructor( private messageService: MessageService, private ventasService:VentasService,
    private confirmationService: ConfirmationService, private fb: FormBuilder, private catalogo: CatalogoService ) { }

  ngOnInit(){
   
    

    this.crearFormulario();
    this.consultaVentas();


  }
 

consultaVentas(){

    this.ventasService.obtenerVentaDetalleEstatusVenta(1).subscribe(data=>{
      this.listaVentasDetalleCliente=data; 
      console.log(this.listaVentasDetalleCliente);      
     
     }); 
  }

  detalleVentaProductos(tvVentasDetalle:TvVentasDetalle){

    this.mostrarProductos=true;
    
    this.ventasService.obtenerProductoVentaId(tvVentasDetalle.nId).subscribe(data => {
        this.listaProductosVenta=data;
    })
    
    }

    generarVentaPdf(tvVentasDetalle:TvVentasDetalle){

        this.ventasService.generarVentaPdf(tvVentasDetalle.nId).subscribe(resp => {
        
          
            const file = new Blob([resp], { type: 'application/pdf' });
            console.log('file: ' + file.size);
            if (file != null && file.size > 0) {
              const fileURL = window.URL.createObjectURL(file);
              const anchor = document.createElement('a');
              anchor.download = 'venta_' + tvVentasDetalle.nId + '.pdf';
              anchor.href = fileURL;
              anchor.click();
              this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'comprobante de venta Generado', life: 3000});
              //una vez generado el reporte limpia el formulario para una nueva venta o cotización 
             
            } else {
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al generar el comprobante de venta', life: 3000});
            }
        
        });
        
        }


        abrir(tvVentasDetalle:TvVentasDetalle){

            this.catalogo.obtenerFormaPago().subscribe(data => {
                this.listaFormaPago = data;
              });

              this.noVenta=tvVentasDetalle.nId;
              this.totalVenta=tvVentasDetalle.nSaldoTotal;

            this.VentaDescuentoDto=tvVentasDetalle;
          
           
            console.log(tvVentasDetalle);
            this.abrirformulario=true;
          
           
          }

          crearFormulario() {

            this.formulario = this.fb.group({
          
            
              idFormaPago: ['', [Validators.required]],
          
            });
          
          }
          cerrarModal() {
            this.abrirformulario = false;
          
            this.limpiaFormulario();
          
          }
          limpiaFormulario() {
           
            this.fProducto.idFormaPago.setValue("");
           }
           
          
          get validaFormaPago() {
            return this.formulario.get('idFormaPago').invalid && this.formulario.get('idFormaPago').touched;
          }    
          
          
          get fProducto() {
            return this.formulario.controls;
          }

          cobrarVenta() {

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
          
             
             console.log( this.VentaDescuentoDto);
            

              let con1= this.catalogo.obtenerFormaPagoId(this.formulario.get('idFormaPago').value);
              let con2=this.catalogo.obtenerEstatusVentaId(2);
             

              forkJoin([con1,con2]).subscribe(data=>{              
         
               this.VentaDescuentoDto.tcFormapago=data[0];
               this.VentaDescuentoDto.tcEstatusVenta=data[1];

               this.guardarCobro();
               this.limpiaFormulario();
               this.abrirformulario=false;


              });
              
           
            
               
          
            

             }
          
          
            }

            guardarCobro(){

                console.log("Esto es el objeto que se estará insertando");
                console.log(this.VentaDescuentoDto);

                this.ventasService.guardaVentaDetalle(this.VentaDescuentoDto).subscribe(data=>{
          
                    this.consultaVentas();
                     
                    this.messageService.add({severity: 'success', summary: 'Correcto', detail: 'Se guardo el cobro de la venta', life: 3000});
                
                
                    });
                   
              
                
    
                 }


            }





            
          
          
          
          
          


  







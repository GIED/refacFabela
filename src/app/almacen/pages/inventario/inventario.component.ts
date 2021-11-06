import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { Product } from 'src/app/demo/domain/product';
import { ProductService } from 'src/app/demo/service/productservice';
import { AnaquelService } from 'src/app/shared/service/anaquel.service';
import { BodegasService } from 'src/app/shared/service/bodegas.service';
import { NivelService } from 'src/app/shared/service/nivel.service';
import { TcBodega } from '../../../productos/model/TcBodega';
import { TcAnaquel } from '../../../productos/model/TcAnaquel';
import { TcNivel } from 'src/app/productos/model/TcNivel';
import { NgxSpinnerService } from 'ngx-spinner';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { BodegaProductosService } from '../../../shared/service/bodega-productos.service';
import { TwProductoBodega } from '../../../productos/model/TwProductoBodega';
import { producto } from '../../../productos/interfaces/producto.interfaces';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.scss']
  
})
export class InventarioComponent implements OnInit {

  countries: any[];

    filteredCountries: any[];

    selectedCountryAdvanced: any[];

    valSlider = 50;

    valColor = '#424242';

    valRadio: string;

    valCheck: string[] = [];

    valSwitch: boolean;

    cities: SelectItem[];

    selectedList: SelectItem;

    selectedDrop: SelectItem;

    selectedMulti: string[] = [];

    valToggle = false;

    paymentOptions: any[];

    valSelect1: string;

    valSelect2: string;

    valueKnob = 20;
    lista:string[]=["hola","que","tal", "estas"];
    productDialog: boolean;

  products: Product[];

  product: Product;

  selectedProducts: Product[];

  submitted: boolean;

  cols: any[];


  listaBodegas: TcBodega[];
  listaAnaquel: TcAnaquel[];
  listaNivel: TcNivel[];
  listaProductos: TwProductoBodega[]=[];

  bodega:number;
  anaquel:number;
  nivel:number;


    constructor(private bodegasService: BodegasService, 
                private anaquelService:AnaquelService,
                private nivelService:NivelService,
                private bodegasProductosService:BodegaProductosService, 
                private spinner: NgxSpinnerService, private productService: ProductService, private messageService: MessageService,
        private confirmationService: ConfirmationService) {
        
    }

    ngOnInit() {
        
        
        this.spinner.show()
        this.bodegasService.obtenerBodegas().subscribe(bodegas=>{
            this.listaBodegas=bodegas;
        });

        this.anaquelService.obtenerAnanquel().subscribe(anaquel =>{
            this.listaAnaquel=anaquel;
        });

        this.nivelService.obtenerNivel().subscribe(nivel =>{
            this.listaNivel=nivel;
        });

        this.spinner.hide();
      
    }

    consultaProducto(){
       

        if (this.bodega != undefined && this.anaquel != undefined && this.nivel != undefined) {

            console.log("entro al if");

            this.bodegasProductosService.consultaInventario(this.bodega, this.anaquel, this.nivel).subscribe(productos => {
                this.listaProductos = productos;
            });

        }

    }
  
    
    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
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
  
    editProduct(product: Product) {
        this.product = {...product};
        this.productDialog = true;
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
  





    filterCountry(event) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.countries.length; i++) {
            const country = this.countries[i];
            if (country.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }

        this.filteredCountries = filtered;
    }


    }

   
    



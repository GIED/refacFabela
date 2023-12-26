import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';
import { TokenService } from '../service/token.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];
    realRol: string;

    constructor(public appMain: AppMainComponent, private tokenService: TokenService) {}

    ngOnInit() {
        const roles = this.tokenService.getRoles();
        roles.forEach(rol =>{
            if (rol === 'ROLE_ADMIN') {
              this.realRol= 'admin';
            }else if (rol === 'ROLE_VENTA') {
              this.realRol= 'ventas';
            }else if (rol === 'ROLE_DISTRIBUIDOR') {
              this.realRol= 'distribuidor';
            }else if (rol === 'ROLE_ALMACEN') {
              this.realRol= 'almacen';
            }else if (rol === 'ROLE_CAJA') {
              this.realRol= 'caja';
            }
          });
        this.model = [
            {label: 'Inicio', icon: 'pi pi-fw pi-home',  visible:this.realRol==='admin' || this.realRol==='ventas' || this.realRol==='almacen' || this.realRol==='caja',  routerLink: ['/inicio/inicio-general']},
            {
                label: 'Administración', icon: 'pi pi-fw pi-cog', visible:this.realRol==='admin'  || this.realRol==='almacen' || this.realRol==='caja',
                items: [
                    {
                        label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['../administracion/usuario'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['../administracion/cliente'], visible:this.realRol==='admin' || this.realRol==='caja'
                    },
                    {
                        label: 'Proveedores', icon: 'pi pi-fw pi-user-minus', routerLink: ['../administracion/proveedor'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Tipo de Cambio', icon: 'pi pi-fw pi-dollar', routerLink: ['../administracion/tipo-cambio'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Créditos', icon: 'pi pi-fw pi-credit-card', routerLink: ['../administracion/creditos'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Descuentos', icon: 'pi pi-fw pi-credit-card', routerLink: ['../ventasycotizaciones/descuento-venta'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Valida comprobantes', icon: 'pi pi-fw pi-credit-card', routerLink: ['../administracion/validaComprobante'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Administración Caja', icon: 'pi pi-fw pi-credit-card', routerLink: ['../administracion/admin-caja'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Venta a crédito', icon: 'pi pi-sliders-h', routerLink: ['../administracion/traspaso-venta-credito'], visible:this.realRol==='admin' || this.realRol==='caja'
                    },
                    {
                        label: 'Tablero de Control', icon: 'pi pi-fw pi-credit-card', routerLink: ['../inicio/tablero'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Productos Cancelados', icon: 'pi pi-fw pi-credit-card', routerLink: ['../administracion/productos-cancelados'], visible:this.realRol==='admin'
                    },
                    {
                        label: 'Ajuste Inventario', icon: 'pi pi-fw pi-credit-card', routerLink: ['../administracion/consulta-ajuste-inventario'], visible:this.realRol==='admin' || this.realRol==='almacen'
                    },

                    
                   

                ]
            },
            {
                label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-dollar', visible:this.realRol==='admin' || this.realRol==='ventas'  || this.realRol==='caja',
                items: [
                    {
                        label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['../ventasycotizaciones/ventas'], visible:this.realRol==='admin' || this.realRol==='ventas'
                    },
                    {
                        label: 'Ventas por Pedido', icon: 'pi pi-fw pi-wallet', routerLink: ['../ventasycotizaciones/ventas-por-pedido'], visible:this.realRol==='admin' || this.realRol==='ventas'
                    },
                   
                    {
                        label: 'Consulta Venta', icon: 'pi pi-fw pi-search', routerLink: ['../ventasycotizaciones/consulta-venta'], visible:this.realRol==='admin' || this.realRol==='ventas' || this.realRol==='caja'
                    },
                    {
                        label: 'Consulta Cotización', icon: 'pi pi-fw pi-search-plus', routerLink: ['../ventasycotizaciones/consulta-cotizacion'],visible:this.realRol==='admin' || this.realRol==='ventas'
                    },
                    {
                        label: 'Cancela Venta', icon: 'pi pi-fw pi-search-minus', routerLink: ['../ventasycotizaciones/cancela-venta'],visible:this.realRol==='admin' 
                    },

                ]
            },
            {
                label: 'Almacen', icon: 'pi pi-fw pi-slack', visible:this.realRol==='admin' || this.realRol==='almacen' ,
                items: [
                    {
                        label: 'Ingreso mercancia', icon: 'pi pi-fw pi-sort-amount-down-alt', routerLink: ['../almacen/ingreso-mercancia'], visible:this.realRol==='admin' || this.realRol==='almacen'
                    },
                    {
                        label: 'Traspasos', icon: 'pi pi-fw pi-sort-alt', routerLink: ['../almacen/traspasos'], visible:this.realRol==='admin' || this.realRol==='almacen'
                    },
                    {
                        label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['../almacen/inventario'], visible:this.realRol==='admin'  || this.realRol==='almacen'
                    },
                    {
                        label: 'Enterega de mercancia', icon: 'pi pi-fwpi-amazon', routerLink: ['../almacen/entrega-de-mercancia'], visible:this.realRol==='admin'  || this.realRol==='almacen'
                    },
                  /*  {
                        label: 'Stock mínimo', icon: 'pi pi-fw pi-spinner', routerLink: ['../almacen/stock-minimo']
                    },*/
                   
                ]
            },
            {
                label: 'Productos', icon: 'pi pi-fw pi-briefcase', visible:this.realRol==='admin' || this.realRol==='ventas' || this.realRol==='almacen'  ,
                items: [
                    {
                        label: 'Registro', icon: 'pi pi-fw pi-external-link', routerLink: ['../productos/registro-producto'], visible:this.realRol==='admin' || this.realRol==='almacen' 
                    },
                    {
                        label: 'Historial', icon: 'pi pi-fw pi-chart-line', routerLink: ['../productos/historial-producto'], visible:this.realRol==='admin' || this.realRol==='almacen' || this.realRol==='ventas'
                    },
                    {
                        label: 'Registro de pedidos', icon: 'pi pi-fw pi-chart-line', routerLink: ['../productos/registro-pedidos'],visible:this.realRol==='admin' || this.realRol==='almacen'
                    },
                    {
                        label: 'Venta Stock', icon: 'pi pi-fw pi-chart-line', routerLink: ['../productos/venta-stock-cero'], visible:this.realRol==='admin'
                    },
                   
                ]
            },
            {
                label: 'Caja', icon: 'pi pi-fw pi-id-card', visible:this.realRol==='admin'   || this.realRol==='caja',
                items: [
                    {
                        label: 'Cobrar', icon: 'pi pi-fw pi-dollar', routerLink: ['../caja/cobrar'], visible:this.realRol==='admin' || this.realRol==='caja'
                    },
                    {
                        label: 'Facturación', icon: 'pi pi-fw pi-ticket', routerLink: ['../caja/facturacion'], visible:this.realRol==='admin' || this.realRol==='caja'
                    },
                    {
                        label: 'Gastos', icon: 'pi pi-fw pi-users', routerLink: ['../caja/gastos-caja'], visible:this.realRol==='admin' || this.realRol==='caja'
                    },
                    
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-sort-numeric-down', routerLink: ['../administracion/creditos'], visible:this.realRol==='admin' || this.realRol==='caja'
                    },
                    
                ]
            },
            {
                label:'Distribuidor', icon: 'pi pi-sitemap', visible:this.realRol==='distribuidor', 
                items:[
                    {
                        label:'Cotizaciones', icon: 'pi pi-globe', routerLink: ['../ventasycotizaciones/ventas-por-internet']
                    },
                    {
                        label:'Pago de Cotizaciones', icon: 'pi pi-dollar', routerLink: ['../ventasycotizaciones/pagos-venta-internet']
                    }

                ]
            }
           /* {
                label: 'Reportes', icon: 'pi pi-fw pi-chart-bar',
                items: [
                    {
                        label: 'Ventas', icon: 'pi pi-fw pi-users', routerLink: ['/reportes/reporte-ventas']
                    },
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-users', routerLink: ['/reportes/reporte-abonos']
                    },
                    
                    
                ]
            },*/
        ];
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}

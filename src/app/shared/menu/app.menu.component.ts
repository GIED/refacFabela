import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from '../../app.main.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public appMain: AppMainComponent) {}

    ngOnInit() {
        this.model = [
            {label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/inicio/tablero']},
            {
                label: 'Administración', icon: 'pi pi-fw pi-cog',
                items: [
                    {
                        label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['../administracion/usuario']
                    },
                    {
                        label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['../administracion/cliente']
                    },
                    {
                        label: 'Proveedores', icon: 'pi pi-fw pi-user-minus', routerLink: ['../administracion/proveedor']
                    },
                    {
                        label: 'Tipo de Cambio', icon: 'pi pi-fw pi-dollar', routerLink: ['../administracion/tipo-cambio']
                    },
                    {
                        label: 'Créditos', icon: 'pi pi-fw pi-credit-card', routerLink: ['../administracion/creditos']
                    },
                   

                ]
            },
            {
                label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-dollar',
                items: [
                    {
                        label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-shopping-cart', routerLink: ['../ventasycotizaciones/ventas']
                    },
                    {
                        label: 'Ventas por Pedido', icon: 'pi pi-fw pi-wallet', routerLink: ['../ventasycotizaciones/ventas-por-pedido']
                    },
                   
                    {
                        label: 'Consulta Venta', icon: 'pi pi-fw pi-search', routerLink: ['../ventasycotizaciones/consulta-venta']
                    },
                    {
                        label: 'Consulta Cotización', icon: 'pi pi-fw pi-search-plus', routerLink: ['../ventasycotizaciones/consulta-cotizacion']
                    },
                    {
                        label: 'Cancela Venta', icon: 'pi pi-fw pi-search-minus', routerLink: ['../ventasycotizaciones/cancela-venta']
                    },

                ]
            },
            {
                label: 'Almacen', icon: 'pi pi-fw pi-slack',
                items: [
                    {
                        label: 'Ingreso mercancia', icon: 'pi pi-fw pi-sort-amount-down-alt', routerLink: ['../almacen/ingreso-mercancia']
                    },
                    {
                        label: 'Traspasos', icon: 'pi pi-fw pi-sort-alt', routerLink: ['../almacen/traspasos']
                    },
                    {
                        label: 'Inventario', icon: 'pi pi-fw pi-book', routerLink: ['../almacen/inventario']
                    },
                    {
                        label: 'Enterega de mercancia', icon: 'pi pi-fwpi-amazon', routerLink: ['../almacen/entrega-de-mercancia']
                    },
                  /*  {
                        label: 'Stock mínimo', icon: 'pi pi-fw pi-spinner', routerLink: ['../almacen/stock-minimo']
                    },*/
                   
                ]
            },
            {
                label: 'Productos', icon: 'pi pi-fw pi-briefcase',
                items: [
                    {
                        label: 'Registro', icon: 'pi pi-fw pi-external-link', routerLink: ['../productos/registro-producto']
                    },
                    {
                        label: 'Historial', icon: 'pi pi-fw pi-chart-line', routerLink: ['../productos/historial-producto']
                    },
                    {
                        label: 'Alternativos', icon: 'pi pi-fw pi-clone', routerLink: ['../productos/alternativo-producto']
                    },
                ]
            },
            {
                label: 'Caja', icon: 'pi pi-fw pi-id-card',
                items: [
                    {
                        label: 'Cobrar', icon: 'pi pi-fw pi-dollar', routerLink: ['../caja/cobrar']
                    },
                    {
                        label: 'Facturación', icon: 'pi pi-fw pi-ticket', routerLink: ['../caja/facturacion']
                    },
                 /*   {
                        label: 'Cierre de caja', icon: 'pi pi-fw pi-users', routerLink: ['../caja/cierre-de-caja']
                    },*/
                    
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-sort-numeric-down', routerLink: ['../caja/abonos']
                    },
                    
                ]
            },
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

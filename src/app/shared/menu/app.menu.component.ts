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
                label: 'Administración', icon: 'pi pi-fw pi-slack',
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
                        label: 'Créditos', icon: 'pi pi-fw pi-users', routerLink: ['../administracion/creditos']
                    },
                   

                ]
            },
            {
                label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-compass',
                items: [
                    {
                        label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-users', routerLink: ['../ventasycotizaciones/ventas']
                    },
                    {
                        label: 'Ventas por Pedido', icon: 'pi pi-fw pi-users', routerLink: ['../ventasycotizaciones/ventas-por-pedido']
                    },
                   
                    {
                        label: 'Consulta Venta', icon: 'pi pi-fw pi-users', routerLink: ['../ventasycotizaciones/consulta-venta']
                    },
                    {
                        label: 'Consulta Cotización', icon: 'pi pi-fw pi-users', routerLink: ['../ventasycotizaciones/consulta-cotizacion']
                    },
                    {
                        label: 'Cancela Venta', icon: 'pi pi-fw pi-users', routerLink: ['../ventasycotizaciones/cancela-venta']
                    },

                ]
            },
            {
                label: 'Almacen', icon: 'pi pi-fw pi-copy',
                items: [
                    {
                        label: 'Ingreso mercancia', icon: 'pi pi-fw pi-users', routerLink: ['../almacen/ingreso-mercancia']
                    },
                    {
                        label: 'Traspasos', icon: 'pi pi-fw pi-users', routerLink: ['../almacen/traspasos']
                    },
                    {
                        label: 'Inventario', icon: 'pi pi-fw pi-users', routerLink: ['../almacen/inventario']
                    },
                    {
                        label: 'Enterega de mercancia', icon: 'pi pi-fw pi-users', routerLink: ['../almacen/entrega-de-mercancia']
                    },
                    {
                        label: 'Stock mínimo', icon: 'pi pi-fw pi-users', routerLink: ['../almacen/stock-minimo']
                    },
                   
                ]
            },
            {
                label: 'Productos', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Registro', icon: 'pi pi-fw pi-users', routerLink: ['../productos/registro-producto']
                    },
                    {
                        label: 'Historial', icon: 'pi pi-fw pi-users', routerLink: ['../productos/historial-producto']
                    },
                    {
                        label: 'Alternativos', icon: 'pi pi-fw pi-users', routerLink: ['../productos/alternativo-producto']
                    },
                ]
            },
            {
                label: 'Caja', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Cobrar', icon: 'pi pi-fw pi-users', routerLink: ['../caja/cobrar']
                    },
                    {
                        label: 'Facturación', icon: 'pi pi-fw pi-users', routerLink: ['../caja/facturacion']
                    },
                    {
                        label: 'Cierre de caja', icon: 'pi pi-fw pi-users', routerLink: ['../caja/cierre-de-caja']
                    },
                    
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-users', routerLink: ['../caja/abonos']
                    },
                    
                ]
            },
            {
                label: 'Reportes', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Ventas', icon: 'pi pi-fw pi-users', routerLink: ['/reportes/reporte-ventas']
                    },
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-users', routerLink: ['/reportes/reporte-abonos']
                    },
                    
                    
                ]
            },
        ];
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}

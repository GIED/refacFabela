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
            {label: 'Inicio', icon: 'pi pi-fw pi-home', routerLink: ['/']},
            {
                label: 'Administración', icon: 'pi pi-fw pi-slack',
                items: [
                    {
                        label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Clientes', icon: 'pi pi-fw pi-user', routerLink: ['./cliente']
                    },
                    {
                        label: 'Proveedores', icon: 'pi pi-fw pi-user-minus', routerLink: ['/uikit']
                    },
                    {
                        label: 'Tipo de Cambio', icon: 'pi pi-fw pi-dollar', routerLink: ['/uikit']
                    },
                    {
                        label: 'Créditos', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Reportes', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },

                ]
            },
            {
                label: 'Ventas y Cotizaciones', icon: 'pi pi-fw pi-compass', routerLink: ['utilities'],
                items: [
                    {
                        label: 'Ventas', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Ventas por Pedido', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Cotizaciones', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Consulta Venta', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Consulta Cotización', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Cancela Venta', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },

                ]
            },
            {
                label: 'Almacen', icon: 'pi pi-fw pi-copy', routerLink: ['/pages'],
                items: [
                    {
                        label: 'Ingreso mercancia', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Traspasos', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Inventario', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Enterega de mercancia', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Stock mínimo', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                   
                ]
            },
            {
                label: 'Productos', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Registro', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Historial', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Alternativos', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                ]
            },
            {
                label: 'Caja', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Cobrar', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Facturación', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Cierre de caja', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Reportes', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    
                ]
            },
            {
                label: 'Reportes', icon: 'pi pi-fw pi-sitemap',
                items: [
                    {
                        label: 'Ventas', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    {
                        label: 'Abonos', icon: 'pi pi-fw pi-users', routerLink: ['/uikit']
                    },
                    
                    
                ]
            },
        ];
    }

    onMenuClick() {
        this.appMain.menuClick = true;
    }
}

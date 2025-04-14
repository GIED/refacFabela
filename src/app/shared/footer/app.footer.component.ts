import { Component } from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer p-d-flex p-jc-between p-ai-center p-p-3" style="background-color: #EFEFEF; color: #333;">
            <div class="logo-text p-d-flex p-ai-center">
                <img src="assets/layout/images/logo4.png" alt="Refacciones Fabela" style="height: 50px; margin-right: 10px;" />
                <div class="text">
                    <h1 class="p-m-0" style="font-size: 1.5rem;">Refacciones Fabela</h1>
                    <span style="font-size: 1rem;">Todo en maquinaria pesada</span>
                </div>
            </div>
            <div class="icons p-d-flex">
                <div class="icon p-mr-3">
                    <i class="pi pi-home" style="font-size: 1.5rem; color: #333;"></i>
                </div>
                <div class="icon p-mr-3">
                    <i class="pi pi-globe" style="font-size: 1.5rem; color: #333;"></i>
                </div>
                <div class="icon">
                    <i class="pi pi-bookmark" style="font-size: 1.5rem; color: #333;"></i>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .layout-footer {
            background-color: #EFEFEF;
            color: #333;
        }
        .logo-text h1 {
            margin: 0;
            font-size: 1.5rem;
        }
        .logo-text span {
            font-size: 1rem;
        }
        .icons .icon {
            margin-right: 1rem;
        }
        .icons .icon i {
            font-size: 1.5rem;
            color: #333;
        }
    `]
})
export class AppFooterComponent {

}
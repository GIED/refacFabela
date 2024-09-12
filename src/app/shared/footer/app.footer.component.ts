import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer" style="background: linear-gradient(100deg, #78866B 20%, #EDE6DB 110%)">
			<div class="logo-text">
				<img src="assets/layout/images/LOGO.png" alt="mirage-layout" />
				<div class="text">
					<h1 style="color: white;">Refacciones Fabela</h1>
					<span style="color: white;">Todo en maquinaria pesada</span>
				</div>
			</div>
			<div class="icons">
				<div class="icon icon-hastag">
					<i class="pi pi-home" style="color: white;"></i>
				</div>
				<div class="icon icon-twitter">
					<i class="pi pi-globe" style="color: white;"></i>
				</div>
				<div class="icon icon-prime">
					<i class="pi pi-bookmark" style="color: white;"></i>
				</div>
			</div>
        </div>
    `
})
export class AppFooterComponent {

}

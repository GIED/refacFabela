import {Component} from '@angular/core';

@Component({
    selector: 'app-footer',
    template: `
        <div class="layout-footer" style="background: #ebd282">
			<div class="logo-text">
				<img src="assets/layout/images/LOGO.png" alt="mirage-layout" />
				<div class="text">
					<h1>Refacciones Fabela</h1>
					<span>Todo en maquinaria pesada</span>
				</div>
			</div>
			<div class="icons">
				<div class="icon icon-hastag">
					<i class="pi pi-home"></i>
				</div>
				<div class="icon icon-twitter">
					<i class="pi pi-globe"></i>
				</div>
				<div class="icon icon-prime">
					<i class="pi pi-bookmark"></i>
				</div>
			</div>
        </div>
    `
})
export class AppFooterComponent {

}

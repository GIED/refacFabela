import {Component} from '@angular/core';
import {AppMainComponent} from './app.main.component';
import { TokenService } from './shared/service/token.service';

@Component({
    selector: 'app-topbar',
    template: `
        <div class="layout-topbar" style="background: #333333;" >
			<div class="layout-topbar-wrapper">
                <div class="layout-topbar-left">
					<div class="layout-topbar-logo-wrapper">
						<a href="#/inicio/inicio-general" class="layout-topbar-logo">
							<img src="assets/layout/images/logo4.png" alt="mirage-layout" />
							<span class="app-name" style="color: white;">Refacciones Fabela</span>
						</a>
					</div>

					<a href="#" class="sidebar-menu-button" style="color: white;" (click)="appMain.onMenuButtonClick($event)">
						<i class="pi pi-bars"></i>
					</a>

					

					<a href="#" class="topbar-menu-mobile-button" style="color: white;" (click)="appMain.onTopbarMobileMenuButtonClick($event)">
						<i class="pi pi-ellipsis-v"></i>
					</a>

					
                </div>
                <div class="layout-topbar-right fadeInDown">
					<ul class="layout-topbar-actions">
						<li>
							<div style="background: white;  min-height: 30px; padding: 8px; box-shadow: 2px 2px 5px white; border-radius: 5px;"><strong><p>Bienvenida(o): {{nombreUsuario}} </p></strong></div>
						</li>
						
						<li #profile class="topbar-item profile-item" [ngClass]="{'active-topmenuitem': appMain.activeTopbarItem === profile}">
							<a href="#" (click)="appMain.onTopbarItemClick($event,profile)">
							<i class="topbar-icon pi pi-user" style="color:white; text-decoration: none;"></i>
							</a>
							<ul class="profile-item-submenu fadeInDown">
								
								<li >
									<button class="p-button p-block " style="color:white;" (click)="onLogOut()">cerrar sesión</button>
								</li>
							</ul>
						</li>
						<li>
							<a href="#" class="layout-rightpanel-button" (click)="appMain.onRightPanelButtonClick($event)">
								<i class="pi pi-arrow-left" style="color: white;"></i>
							</a>
						</li>
                    </ul>

					<ul class="profile-mobile-wrapper">
						<li #mobileProfile class="topbar-item profile-item" style="color: white;" [ngClass]="{'active-topmenuitem': appMain.activeTopbarItem === mobileProfile}">
							<a href="#" (click)="appMain.onTopbarItemClick($event,mobileProfile)">
                          
							</a>
							
						</li>
					</ul>
                </div>
            </div>
        </div>
    `
})
export class AppTopBarComponent {

    activeItem: number;
	nombreUsuario:string;

    constructor(public appMain: AppMainComponent, private tokenService: TokenService) {
		this.nombreUsuario = this.tokenService.getNameUser();
	}

    mobileMegaMenuItemClick(index) {
        this.appMain.megaMenuMobileClick = true;
        this.activeItem = this.activeItem === index ? null : index;
    }



	onLogOut(){
		this.tokenService.logout();
		
	  }

}

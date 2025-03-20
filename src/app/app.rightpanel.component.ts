import {Component, Inject, forwardRef} from '@angular/core';
import {AppMainComponent} from './app.main.component';

@Component({
    selector: 'app-rightpanel',
    template: `
        <div class="layout-rightpanel" (click)="appMain.onRightPanelClick($event)">
			<div class="right-panel-header" style="background: #333333; color: white;">				
				<a href="#" class="rightpanel-exit-button" (click)="appMain.onRightPanelClose($event)">
					<i class="pi pi-times"></i>
				</a>
			</div>
			<div class="right-panel-content">
				
				<div class="right-panel-content-row">
					<div class="calendar">
						<h1>Calendario</h1>
						<p-calendar [inline]="true"></p-calendar>
					</div>
				</div>
				
            </div>
        </div>
    `
})
export class AppRightPanelComponent {
    constructor(public appMain: AppMainComponent) {}
}

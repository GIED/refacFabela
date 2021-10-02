/* tslint:disable:no-unused-variable */

import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AppMainComponent } from './app.main.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AppFooterComponent } from './shared/footer/app.footer.component';
import { AppMenuComponent } from './shared/menu/app.menu.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { CalendarModule } from 'primeng/calendar';
import { TabViewModule } from 'primeng/tabview';
import { CheckboxModule } from 'primeng/checkbox';
import { AppRightPanelComponent } from './app.rightpanel.component';


describe('AppComponent', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule, ScrollPanelModule, CalendarModule, TabViewModule, CheckboxModule],
            declarations: [
                AppComponent,
                AppMainComponent,
                AppMenuComponent,
                AppTopBarComponent,              
                AppRightPanelComponent,
                AppFooterComponent
                
            ],
            providers: []
        });
        TestBed.compileComponents();
    });

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});

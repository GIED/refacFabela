import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';


// Application Components
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {AppMainComponent} from './app.main.component';
import {AppMenuComponent} from './shared/menu/app.menu.component';
import {AppMenuitemComponent} from './shared/menu/app.menuitem.component';
import {AppBreadcrumbComponent} from './app.breadcrumb.component';
import {AppRightPanelComponent} from './app.rightpanel.component';
import {AppTopBarComponent} from './app.topbar.component';
import {AppFooterComponent} from './shared/footer/app.footer.component';



// Application services
import {BreadcrumbService} from './breadcrumb.service';
import {MenuService} from './shared/menu/app.menu.service';
import {AppCodeModule} from './app.code.component';


import { PrimeModule } from './shared/prime/prime.module';



@NgModule({
    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppRightPanelComponent,
        AppBreadcrumbComponent
        
    ],
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
        AppCodeModule,
        HttpClientModule,
        BrowserAnimationsModule,
        PrimeModule
        
    ],
    providers: [
        {provide: LocationStrategy, useClass: HashLocationStrategy},
         MenuService, BreadcrumbService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

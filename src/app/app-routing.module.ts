import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import { AppMainComponent } from './app.main.component';




@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                   
                ]
            }
        ], {scrollPositionRestoration: 'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

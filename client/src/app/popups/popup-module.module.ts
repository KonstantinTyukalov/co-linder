import { NgModule } from '@angular/core';
import { PopupComponent } from './popup.component';
import { PopupLoadingComponent } from './popup-loading/popup-loading.component';
import { PopupUserErrorComponent } from './popup-user-error/popup-user-error.component';

@NgModule({
    declarations: [
        PopupComponent,
        PopupLoadingComponent,
        PopupUserErrorComponent
    ],
    exports: [
        PopupComponent,
        PopupLoadingComponent,
        PopupUserErrorComponent
    ],
    imports: []
})
export class PopupModule { }

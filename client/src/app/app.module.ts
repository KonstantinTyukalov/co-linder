import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { RegistrationComponent } from "./components/registration/registration.component";
import { LoginComponent } from "./components/login/login.component";
import { FormsModule } from "@angular/forms";
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from "./store/effects/user.effects";
import { UserService } from "./services/user.service";

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot({}),
        FormsModule,
        EffectsModule.forRoot([UserEffects]),
        StoreModule.forRoot({}, {})
    ],
    providers: [
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

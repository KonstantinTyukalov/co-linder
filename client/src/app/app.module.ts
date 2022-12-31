import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { UserEffects } from '@store/effects/user.effects';
import { UserService } from '@services/user.service';
import * as UserStore from '@store/reducers/user.reducer';
import { PocketBaseService } from '@services/pb.service';
import { FlatEffects } from '@store/effects/flat.effects';
import { ChatEffects } from '@store/effects/chat.effects';
import * as FlatStore from '@store/reducers/flat.reducer';
import * as ChatStore from '@store/reducers/chat.reducer';
import { RegistrationComponent } from '@components/registration/registration.component';
import { LoginComponent } from '@components/login/login.component';
import { ContentModule } from '@components/content/content.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopupModule } from './popups/popup-module.module';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        EffectsModule.forRoot([
            UserEffects,
            FlatEffects,
            ChatEffects
        ]),
        StoreModule.forRoot({
            USER_STATE: UserStore.reducer,
            FLAT_STATE: FlatStore.reducer,
            CHAT_STATE: ChatStore.reducer
        }),
        ContentModule,
        PopupModule
    ],
    providers: [
        PocketBaseService,
        UserService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}

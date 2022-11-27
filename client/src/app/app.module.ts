import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { UserEffects } from './store/effects/user.effects';
import { UserService } from './services/user.service';
import { ApartmentsComponent } from './components/apartments/apartments.component';
import { MenuComponent } from './components/menu/menu.component';
import { TestComponent } from './components/test/test.component';
import { FlatEffects } from './store/effects/flat.effects';
import * as FlatStore from './store/reducers/flat.reducer';
import * as ChatStore from './store/reducers/chat.reducer';
import * as UserStore from './store/reducers/user.reducer';
import { FlatService } from './services/flat.service';
import { PocketBaseService } from './services/pb.service';
import { FlatComponent } from './components/flat/flat.component';
import { FlatCardComponent } from './components/flat-card/flat-card.component';
import { ChatService } from './services/chat.service';
import { ChatComponent } from './components/chat/chat.component';
import { ChatEffects } from './store/effects/chat.effects';
import { ChatsComponent } from './components/chats/chats.component';
import { UserComponent } from './components/user/user.component';
import { LeftSidebarComponent } from './components/left-sidebar/left-sidebar.component';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegistrationComponent,
        ApartmentsComponent,
        MenuComponent,
        TestComponent,
        FlatComponent,
        FlatCardComponent,
        ChatComponent,
        ChatsComponent,
        UserComponent,
        LeftSidebarComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        StoreModule.forRoot({}),
        FormsModule,
        EffectsModule.forRoot([UserEffects, FlatEffects, ChatEffects]),
        StoreModule.forRoot({
            FLAT_STATE: FlatStore.reducer,
            CHAT_STATE: ChatStore.reducer,
            USER_STATE: UserStore.reducer
        })
    ],
    providers: [
        PocketBaseService,
        UserService,
        FlatService,
        ChatService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}

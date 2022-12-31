import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ContentComponent } from './content.component';
import { ApartmentsComponent } from './apartments/apartments.component';
import { MenuComponent } from '../menu/menu.component';
import { TestComponent } from '../test/test.component';
import { ChatComponent } from './chat/chat.component';
import { FlatService } from '@services/flat.service';
import { ChatService } from '@services/chat.service';
import { FlatComponent } from './flat/flat.component';
import { FlatCardComponent } from './flat-card/flat-card.component';
import { ChatsComponent } from './chats/chats.component';
import { UserComponent } from './user/user.component';
import { LeftSidebarComponent } from './left-sidebar/left-sidebar.component';

@NgModule({
    declarations: [
        ContentComponent,
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
        FormsModule,
        CommonModule
    ],
    providers: [
        FlatService,
        ChatService
    ]
})
export class ContentModule { }

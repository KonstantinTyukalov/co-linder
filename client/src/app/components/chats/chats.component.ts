import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as ChatActions from '../../store/actions/chat.actions'
import { Chat } from "../../dto/chat.dto";

import * as ChatSelector from '../../store/selectors/chat.selectors';
import { Observable } from "rxjs";

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

    public chats$: Observable<Chat[]> = this.store.select(ChatSelector.chats);

    constructor(private readonly store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(ChatActions.getChatsByUserId({ id: '' }));
    }

}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as ChatActions from '../../store/actions/chat.actions'
import { Chat } from "../../dto/chat.dto";

import * as ChatSelector from '../../store/selectors/chat.selectors';
import { combineLatest, Observable, Subscription } from "rxjs";
import { ActivatedRoute } from "@angular/router";
import * as UserSelector from "../../store/selectors/user.selectors";
import { ChatService } from "../../services/chat.service";
import { ChatMessage } from "../../dto/chatMessage.dto";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    public chat$: Observable<Chat | undefined> = this.store.select(ChatSelector.chat);
    public user$ = this.store.select(UserSelector.user);

    public message: string = '';

    private subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly route: ActivatedRoute,
        private readonly chatService: ChatService
    ) {
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            combineLatest(
                this.route.params,
                this.user$
            ).subscribe(([param, user]) => {
                const userId = param['id'];
                if (userId) {
                    this.store.dispatch(ChatActions.getChatById({ userId }));
                }
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    public onClickSend(): void {
        this.subscriptions.add(
            combineLatest(
                this.chat$,
                this.user$
            ).subscribe(([chat, user]) => {
                this.chatService.sendMessage({
                    chat: chat,
                    sender: user,
                    content: this.message
                } as ChatMessage)
            })
        );

    }
}

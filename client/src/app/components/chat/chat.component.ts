import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ChatActions from '../../store/actions/chat.actions';

import * as ChatSelector from '../../store/selectors/chat.selectors';
import { combineLatest, Subscription, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as UserSelector from '../../store/selectors/user.selectors';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../dto/chatMessage.dto';
import { Location } from '@angular/common';
import { chats } from '../../store/selectors/chat.selectors';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    public chats$ = this.store.select(chats);
    public chat$ = this.store.select(ChatSelector.chat);
    public user$ = this.store.select(UserSelector.user);

    public message: string = '';

    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly route: ActivatedRoute,
        private readonly chatService: ChatService,
        private readonly router: Router,
        private readonly location: Location
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
                    this.store.dispatch(ChatActions.getChatById({ currentUser: user!, targetUserId: userId }));
                }
            })
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
            ).pipe(take(1)).subscribe(([chat, user]) => {
                this.chatService.sendMessage({
                    chat,
                    sender: user,
                    content: this.message
                } as ChatMessage);

                this.message = '';
            })
        );
    }
}

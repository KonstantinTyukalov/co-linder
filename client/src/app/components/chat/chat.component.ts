import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as ChatActions from '../../store/actions/chat.actions';

import * as ChatSelector from '../../store/selectors/chat.selectors';
import { Subscription, take } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../dto/chatMessage.dto'; import { user } from '../../store/selectors/user.selectors'; import { User } from '../../dto/user.dto';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    public user?: User;

    public chat$ = this.store.select(ChatSelector.chat);

    public message: string = '';

    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly route: ActivatedRoute,
        private readonly chatService: ChatService
    ) {
        this.store.select(user).subscribe((user) => {
            this.user = user;
        });
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.route.params.subscribe((param) => {
                const chatId = param['id'];

                if (chatId) {
                    this.store.dispatch(ChatActions.getChatById({ chatId }));
                }
            })
        );
    }

    public onKeyDown(event: KeyboardEvent) {
        console.log(event);
        if (event.key === 'Enter') {
            this.onClickSend();
        }
    }

    public onClickSend(): void {
        this.subscriptions.add(
            this.chat$.pipe(take(1))
                .subscribe((chat) => {
                    this.chatService.sendMessage({
                        chat,
                        sender: this.user,
                        content: this.message
                    } as ChatMessage);

                    this.message = '';
                })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

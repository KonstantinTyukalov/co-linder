import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as ChatActions from '../../store/actions/chat.actions'
import { Chat } from "../../dto/chat.dto";

import * as ChatSelector from '../../store/selectors/chat.selectors';
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, OnDestroy {
    public chat$: Observable<Chat | undefined> = this.store.select(ChatSelector.chat);

    private subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private route: ActivatedRoute
    ) {
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.route.params.subscribe(params => {
                const chatId = params['id'];
                if (chatId) {
                    this.store.dispatch(ChatActions.getChatById({ id: chatId }));
                }
            }),
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

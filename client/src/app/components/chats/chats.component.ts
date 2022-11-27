import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as ChatActions from '../../store/actions/chat.actions'
import { Chat } from "../../dto/chat.dto";
import * as UserSelector from "../../store/selectors/user.selectors";
import * as ChatSelector from '../../store/selectors/chat.selectors';
import { combineLatest, Observable, Subscription } from "rxjs";
import { Router } from '@angular/router';
import { User } from 'src/app/dto/user.dto';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy {

    @Input() public user$?: Observable<User | undefined>;
    @Input() public chats$?: Observable<Chat[]>;

    public localUser: User = {} as User;

    constructor(private readonly store: Store, private readonly router: Router) {
    }

    private subscriptions: Subscription = new Subscription();

    public onClickRedirect(chat: Chat): void {
        const chatUser = chat.users?.find((u) => u.id !== this.localUser.id);
        if (chatUser) {
            this.router.navigate(['/chat', chatUser.id], { replaceUrl: true });
        } else {
            console.error("CANT REDIRECT TO CHAT")
        }
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.user$?.subscribe((user) => {
                if (user) {
                    this.localUser = user;
                    this.store.dispatch(ChatActions.getChatsByUserId({ id: user.id! }));
                }
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

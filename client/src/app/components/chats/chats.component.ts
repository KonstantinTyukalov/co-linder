import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Chat } from '../../dto/chat.dto';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/dto/user.dto';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {
    @Input() public user$?: Observable<User | undefined>;
    @Input() public chats$?: Observable<Chat[]>;

    constructor(
        private readonly store: Store,
        private readonly router: Router) {
    }

    public onClickRedirect(chat: Chat): void {
        this.router.navigate(['/chat', chat.id], { replaceUrl: true });
    }
}

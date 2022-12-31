import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';

import { chats } from '@store/selectors/chat.selectors';
import { User } from '@dto/user.dto';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {
    @Input() public user?: User;
    public chats$ = this.store.select(chats);

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {
    }

    public onClickRedirect(chatId: string): void {
        this.router.navigate(['/chat', chatId]);
    }
}

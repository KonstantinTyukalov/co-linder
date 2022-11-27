import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/dto/user.dto'; import { chats } from '../../store/selectors/chat.selectors';

@Component({
    selector: 'app-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss']
})
export class ChatsComponent {
    @Input() public user$?: Observable<User | undefined>;
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

import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../dto/user.dto';

import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import * as ChatActions from '../../store/actions/chat.actions';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
    @Input() user?: User;

    constructor(
        private readonly location: Location,
        private readonly store: Store
    ) {
    }

    ngOnInit(): void {
        if (this.user?.id) {
            this.store.dispatch(ChatActions.getAllChatsByUserId({ id: this.user.id }));
        }
    }

    public onBackClick(): void {
        this.location.back();
    }
}

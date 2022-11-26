import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as FlatActions from '../../store/actions/flat.actions'
import * as UserSelector from '../../store/selectors/user.selectors'
import { Flat } from "../../dto/flat.dto";

import * as FlatSelector from '../../store/selectors/flat.selectors';
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { ChatService } from 'src/app/services/chat.service';

@Component({
    selector: 'app-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit, OnDestroy {
    public flat$ = this.store.select(FlatSelector.flat);

    private subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly chatService: ChatService
    ) {
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.route.params.subscribe(params => {
                const flatId = params['id'];
                if (flatId) {
                    this.store.dispatch(FlatActions.getFlatById({ id: flatId }));
                }
            }),
        );
    }

    public async onUserClick(userId: string | undefined) {

        if (userId) {
            const chat = await this.chatService.tryGetChatWithUser(userId);

            this.router.navigate(['chat', chat.id]);
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

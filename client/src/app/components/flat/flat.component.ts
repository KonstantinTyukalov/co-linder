import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as UserSelector from '../../store/selectors/user.selectors';
import * as FlatActions from '../../store/actions/flat.actions';

import * as FlatSelector from '../../store/selectors/flat.selectors';
import { combineLatest, Subscription, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Location } from '@angular/common';
import { FlatService } from '../../services/flat.service';
import { FlatComment } from '../../dto/flatComment.dto';
import { currentFlat } from '../../store/selectors/flat.selectors';

@Component({
    selector: 'app-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit, OnDestroy {
    public flatDownloadedPhotos$ = this.store.select(currentFlat.downloadedPhotos);
    public flatName$ = this.store.select(currentFlat.name);
    public flatCost$ = this.store.select(currentFlat.cost);
    public flatArea$ = this.store.select(currentFlat.area);
    public flatDescription$ = this.store.select(currentFlat.description);
    public flatExternalUrl$ = this.store.select(currentFlat.externalUrl);
    public flatComments$ = this.store.select(currentFlat.comments);
    public flatInterestedUsers$ = this.store.select(currentFlat.interestedUsers);
    public flatOwner$ = this.store.select(currentFlat.owner);

    public flat$ = this.store.select(FlatSelector.flat);
    public user$ = this.store.select(UserSelector.user);

    public content = '';

    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly chatService: ChatService,
        private readonly location: Location,
        private readonly flatService: FlatService
    ) {
    }

    public ngOnInit(): void {
        this.subscriptions.add(
            this.route.params.subscribe(params => {
                const flatId = params['id'];
                if (flatId) {
                    this.store.dispatch(FlatActions.getFlatById({ id: flatId }));
                }
            })
        );
    }

    public onBackClick(): void {
        this.location.back();
    }

    public onSendClick(): void {
        this.subscriptions.add(
            combineLatest(
                this.flat$,
                this.user$
            ).pipe(
                take(1)
            ).subscribe(([flat, user]) => {
                this.flatService.addFlatComment({
                    flat,
                    user,
                    content: this.content
                } as FlatComment);
            })
        );
    }

    public intrested(): void {
        this.subscriptions.add(
            combineLatest(
                this.flat$,
                this.user$
            ).pipe(
                take(1)
            ).subscribe(([flat, user]) => {
                this.store.dispatch(FlatActions.updateFlat({ user: user!, flat: flat! }));
            })
        );
    }

    public readyToLive(): void {
        this.subscriptions.add(
            combineLatest(
                this.flat$,
                this.user$
            ).pipe(
                take(1)
            ).subscribe(([flat, user]) => {
                this.store.dispatch(FlatActions.updateFlat({ user: user!, flat: flat! }));
            })
        );
    }

    public async onUserClick(userId: string | undefined) {
        if (userId) {
            this.router.navigate(['chat', userId]);
        }
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';

import { ChatService } from '@services/chat.service';
import { FlatComment } from '@dto/flatComment.dto';
import { User } from '@dto/user.dto';
import { Flat } from '@dto/flat.dto';
import { currentFlat, flat } from '@store/selectors/flat.selectors';
import { FlatService } from '@services/flat.service';
import { user } from '@store/selectors/user.selectors';
import * as FlatActions from '@store/actions/flat.actions';

@Component({
    selector: 'app-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit, OnDestroy {
    public flatName?: string;
    public flatDownloadedPhotos?: string[];
    public flatCost?: number;
    public flatArea?: string;
    public flatDescription?: string;
    public flatExternalUrl?: string;
    public flatComments?: FlatComment[];
    public flatInterestedUsers?: User[];
    public flatOwner?: User;

    public flat?: Flat;
    public user?: User;

    public content = '';

    private readonly subscriptions: Subscription = new Subscription();

    constructor(
        private readonly elRef: ElementRef,
        private readonly store: Store,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly chatService: ChatService,
        private readonly location: Location,
        private readonly flatService: FlatService
    ) {
        this.subscribeOn(currentFlat.name, 'flatName');
        this.subscribeOn(currentFlat.cost, 'flatDownloadedPhotos');
        this.subscribeOn(currentFlat.downloadedPhotos, 'flatDownloadedPhotos');
        this.subscribeOn(currentFlat.area, 'flatArea');
        this.subscribeOn(currentFlat.description, 'flatDescription');
        this.subscribeOn(currentFlat.externalUrl, 'flatExternalUrl');
        this.subscribeOn(currentFlat.comments, 'flatComments');
        this.subscribeOn(currentFlat.interestedUsers, 'flatInterestedUsers');
        this.subscribeOn(currentFlat.owner, 'flatOwner');

        this.subscribeOn(user, 'user');
        this.subscribeOn(flat, 'flat');
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

    public onSendClick(): void {
        if (this.flat && this.user && this.content) {
            this.flatService.sendFlatComment({
                flat: this.flat,
                sender: this.user,
                content: this.content
            } as FlatComment);
        }
    }

    public setMeAsInterested(): void {
        if (this.flat?.id && this.user?.id) {
            this.flatService.addUserToInterested(this.user.id, this.flat.id);
        }
    }

    public async onUserClick(userId: string) {
        if (this.user) {
            const chat = await this.chatService.tryGetChatWithUser(this.user, userId);

            if (chat) {
                this.router.navigate(['chat', chat.id]);
            }
        }
    }

    public onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            this.onSendClick();
        }
    }

    private subscribeOn(
        selector: any,
        field: keyof FlatComponent
    ): void {
        this.subscriptions.add(
            this.store.select(selector).subscribe((obj) => {
                // @ts-expect-error
                this[field] = obj;
                console.log(this.flatName);
            })
        );
    }

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

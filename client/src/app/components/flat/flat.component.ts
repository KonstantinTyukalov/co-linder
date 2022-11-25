import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as FlatActions from '../../store/actions/flat.actions'
import { Flat } from "../../dto/flat.dto";

import * as FlatSelector from '../../store/selectors/flat.selectors';
import { Observable, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
    selector: 'app-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit, OnDestroy {
    public flat$: Observable<Flat | undefined> = this.store.select(FlatSelector.flat);

    private subscriptions: Subscription = new Subscription();

    constructor(
        private readonly store: Store,
        private route: ActivatedRoute
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

    public ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }
}

import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as FlatActions from '../../store/actions/flat.actions'
import { Flat } from "../../dto/flat.dto";

import * as FlatSelector from '../../store/selectors/flat.selectors';
import { Observable } from "rxjs";

@Component({
    selector: 'app-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit {
    public flat$: Observable<Flat> = this.store.select(FlatSelector.flat);

    constructor(private readonly store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(FlatActions.getFlatById({ id: '' }));
    }

}

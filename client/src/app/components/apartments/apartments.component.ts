import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

import * as FlatActions from '../../store/actions/flat.actions'
import { Flat } from "../../dto/flat.dto";

import * as FlatSelector from '../../store/selectors/flat.selectors';
import { Observable } from "rxjs";

@Component({
    selector: 'app-apartments',
    templateUrl: './apartments.component.html',
    styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {

    public flats$: Observable<Flat[]> = this.store.select(FlatSelector.flats);

    constructor(private readonly store: Store) {
    }

    ngOnInit(): void {
        this.store.dispatch(FlatActions.getFlats());
    }

}

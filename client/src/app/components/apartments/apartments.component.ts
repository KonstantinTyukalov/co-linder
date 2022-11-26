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
    public area!: string;
    public name!: string;
    public costMax!: number
    public costMin!: number
    public capacityMin!: number;
    public interestedMin!: number;
    public readyToLiveMin!: number;
    public readyToLiveMax!: number;
    public createdMin!: Date;


    public flats$: Observable<Flat[]> = this.store.select(FlatSelector.flats);

    constructor(private readonly store: Store) {
    }

    public ngOnInit(): void {
        this.store.dispatch(FlatActions.getFlats());
    }

    public onClickFilter(): void {
        this.store.dispatch(FlatActions.getFlatsByFilters({
            area: this.area,
            name: this.name,
            costMax: this.costMax,
            costMin: this.costMin,
            capacityMin: this.capacityMin,
            interestedMin: this.interestedMin,
            readyToLiveMin: this.readyToLiveMin,
            readyToLiveMax: this.readyToLiveMax,
            createdMin: this.createdMin
        }))
    }

}

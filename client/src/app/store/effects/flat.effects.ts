import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { FlatService } from '../../services/flat.service';
import * as FlatActions from '../actions/flat.actions';
import { from, switchMap } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class FlatEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly flatService: FlatService
    ) {
    }

    getFlats$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FlatActions.getFlats),
            switchMap(() => {
                return from(this.flatService.getFlats());
            }),
            map((flats) => {
                return FlatActions.getFlatsSuccess({ flats: flats });
            })
        )
    })
}
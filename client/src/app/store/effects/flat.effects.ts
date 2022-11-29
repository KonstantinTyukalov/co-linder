import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FlatService } from '../../services/flat.service';
import * as FlatActions from '../actions/flat.actions';
import { from, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { Flat } from 'src/app/dto/flat.dto';

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
            map((flats: Flat[]) => {
                return FlatActions.getFlatsSuccess({ flats });
            })
        );
    });

    getFlatById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FlatActions.getFlatById),
            switchMap((action: { id: string; }) => {
                return from(this.flatService.getFlatWithComments(action.id));
            }),
            map((flat: Flat) => {
                return FlatActions.getFlatByIdSuccess({ flat });
            })
        );
    });

    getFlatsByFilters$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(FlatActions.getFlatsByFilters),
            switchMap((actions: {
                area: string;
                costMax: number;
                capacityMin: number;
            }) => {
                return from(this.flatService.searchFlat(1, {
                    area: actions.area, costMax: actions.costMax, capacityMax: actions.capacityMin
                }));
            }),
            map((flats) => {
                return FlatActions.getFlatsSuccess({ flats });
            })
        );
    });
}

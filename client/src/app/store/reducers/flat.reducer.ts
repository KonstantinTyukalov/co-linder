import { Flat } from '../../dto/flat.dto';
import { createReducer, on } from '@ngrx/store';
import * as FlatsActions from '../actions/flat.actions';

export interface FlatsState {
    flats: Flat[];
    currentFlat?: Flat;
    flatNotFoundErr?: string;
}

export const initialState: FlatsState = {
    flats: [],
};

export const reducer = createReducer(
    initialState,
    on(FlatsActions.getFlatsSuccess, (state, { flats }) => ( { ...state, flats } )),
    on(FlatsActions.getFlatByIdSuccess, (state, { flat }) => ( { ...state, currentFlat: flat } )),
);

import { Flat } from '../../dto/flat.dto';
import { createReducer, on } from '@ngrx/store';
import * as FlatActions from '../actions/flat.actions';

export interface FlatState {
    flat: Flat;
    flatNotFoundErr: string;
}

export const initialState: FlatState = {
    flat: {
        id?: string;
        externalUrl?: string;
        photo?: File;
        name: string; // "Flat in center" or address
        owner: User;
        area: string; // city or region in city
        cost: number;
        capacity: number;
        description: string;
        created: Date;
        updated: Date;
    },
    productNotFoundErr: '',
};

export const reducer = createReducer(
    initialState,
    on(FlatActions.getFlatsSuccess, (state, { product }) => ({
        ...state,
        product: product,
    })),
);

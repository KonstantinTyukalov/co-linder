import { Flat } from '../../dto/flat.dto';
import { createReducer, on } from '@ngrx/store';
import * as FlatsActions from '../actions/flat.actions';

export interface FlatsState {
    flats: Flat[];
    flat?: Flat;

    flatNotFoundErr?: string;
}

export const initialState: FlatsState = {
    flats: []
};

export const reducer = createReducer(
    initialState,
    on(FlatsActions.getFlatsSuccess, (state, { flats }) => ({ ...state, flats })),
    on(FlatsActions.getFlatByIdSuccess, (state, { flat }) => ({ ...state, flat })),
    on(FlatsActions.updateFlatComments, (state, { comment }) => {
        const thisComment = [...state.flat!.comments!];
        thisComment.push(comment);
        return { ...state, flat: { ...state.flat!, comments: thisComment } };
    })
);

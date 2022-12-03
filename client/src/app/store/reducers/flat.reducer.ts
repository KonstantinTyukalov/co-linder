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
    on(FlatsActions.updateFlatComments, (state, { comment: newestComment }) => {
        const updatedComments = [...state.flat!.comments ?? []];

        if (!updatedComments.find(c => c.id === newestComment.id)) {
            updatedComments.push(newestComment);
        }

        return { ...state, flat: { ...state.flat!, comments: updatedComments } };
    }),
    on(FlatsActions.updateFlatInterested, (state, { users }) => {
        return { ...state, flat: { ...state.flat!, interestedUsers: users } };
    })
);

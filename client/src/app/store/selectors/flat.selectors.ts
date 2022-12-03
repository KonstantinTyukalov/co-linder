import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FlatsState } from '../reducers/flat.reducer';

export const state = createFeatureSelector<FlatsState>('FLAT_STATE');

export const flats = createSelector(state, state => state.flats);

export const flat = createSelector(state, state => state.flat);

export const currentFlat = {
    name: createSelector(state, state => state.flat?.name),
    cost: createSelector(state, state => state.flat?.cost),
    description: createSelector(state, state => state.flat?.description),
    area: createSelector(state, state => state.flat?.area),
    comments: createSelector(state, state => state.flat?.comments),
    interestedUsers: createSelector(state, state => state.flat?.interestedUsers),
    owner: createSelector(state, state => state.flat?.owner),
    downloadedPhotos: createSelector(state, state => state.flat?.downloadedPhotos),
    externalUrl: createSelector(state, state => state.flat?.externalUrl)
};

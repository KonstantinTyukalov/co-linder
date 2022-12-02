import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../reducers/user.reducer';

export const state = createFeatureSelector<UserState>('USER_STATE');

export const user = createSelector(state, state => state.user);

export const isUserLoading = createSelector(state, state => state.isUserLoading);
export const userError = createSelector(state, state => state.userError);

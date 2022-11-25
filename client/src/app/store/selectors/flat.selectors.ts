import { createFeatureSelector, createSelector } from "@ngrx/store";
import { FlatsState } from "../reducers/flat.reducer";

export const state = createFeatureSelector<FlatsState>('FLAT_STATE');

export const flats = createSelector(state, state => state.flats);
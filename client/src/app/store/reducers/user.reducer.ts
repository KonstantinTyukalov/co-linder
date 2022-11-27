import { User } from '../../dto/user.dto';
import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';

export interface UserState {
    user?: User;
}

export const initialState: UserState = {};

export const reducer = createReducer(
    initialState,
    on(UserActions.userCreateOrUpdateInStore, (state, { user }) => ({
        ...state, user
    }))
);

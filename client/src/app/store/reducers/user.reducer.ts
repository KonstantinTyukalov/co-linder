import { createReducer, on } from '@ngrx/store';

import { User } from '@dto/user.dto';

import * as UserActions from '../actions/user.actions';

export interface UserState {
    user?: User;
    isUserLoading: boolean;
    userError?: Error;
}

export const initialState: UserState = { isUserLoading: false };

export const reducer = createReducer(
    initialState,
    on(UserActions.userCreateOrUpdateInStore, (state, { user }) => ({
        ...state, user, isUserLoading: false
    })),
    on(UserActions.userLoading, (state) => ({
        ...state, isUserLoading: true
    })),
    on(UserActions.userError, (state, { error }) => ({
        ...state, userError: error, isUserLoading: false
    })),
    on(UserActions.clearUserError, (store) => ({
        ...store, userError: undefined, isUserLoading: false
    }))
);

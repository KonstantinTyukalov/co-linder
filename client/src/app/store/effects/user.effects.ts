import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UserService } from '../../services/user.service';
import * as UserActions from '../actions/user.actions';
import {
    catchError, from, of, switchMap, tap
} from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../../dto/user.dto';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { userLoading } from '../actions/user.actions';

@Injectable()
export class UserEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly userService: UserService,
        private readonly router: Router,
        private readonly store: Store
    ) {

    }

    registrationUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.registrationUser),
            switchMap((action: { user: User; file?: File; }) => {
                return from(this.userService.registerUser(action.user, action.file));
            }),
            map(() => {
                return UserActions.registrationUserSuccess();
            })
        );
    });

    loginUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.userLogin),
            tap(() => {
                this.store.dispatch(userLoading());
            }),
            switchMap((action: { login: string; password: string; }) => {
                return from(this.userService.loginUser(action.login, action.password)).pipe(
                    tap((user) => {
                        localStorage.setItem('userMetaData', JSON.stringify(user));
                    }),
                    map((user: User) => {
                        this.router.navigate(['menu']);
                        return UserActions.userCreateOrUpdateInStore({ user });
                    }),
                    catchError((error) => {
                        console.log('Error in user effect: ', error);
                        return of(UserActions.userError({ error: error as Error }));
                    })
                );
            })
        );
    });
}

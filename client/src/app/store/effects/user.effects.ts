import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/user.service";
import * as UserActions from "../actions/user.actions";
import { catchError, delayWhen, EMPTY, from, switchMap, tap } from "rxjs";
import { map } from 'rxjs/operators'
import { User } from "../../dto/user.dto";
import { Router } from "@angular/router";

@Injectable()
export class UserEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly userService: UserService,
        private readonly router: Router
    ) {

    }

    registrationUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.registrationUser),
            switchMap((action: { user: User }) => {
                return from(this.userService.registerUser(action.user));
            }),
            map(() => {
                return UserActions.registrationUserSuccess()
            })
        );
    });

    loginUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.userLogin),
            switchMap((action: { login: string, password: string }) => {
                return from(this.userService.loginUser(action.login, action.password)).pipe(
                    tap((user) => {
                        localStorage.setItem('userMetaData', JSON.stringify(user));
                    })
                )
            }),
            map((user: User) => {
                return UserActions.userCreateOrUpdateInStore({ user })
            }),
            catchError((err) => {
                console.log(err);
                return EMPTY;
            })
        )
    });
}

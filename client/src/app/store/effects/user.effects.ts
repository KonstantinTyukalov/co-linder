import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/user.service";
import * as UserActions from "../actions/user.actions";
import { delayWhen, EMPTY, from, switchMap, tap } from "rxjs";
import { map } from 'rxjs/operators'
import { User } from "../../dto/user.dto";
import { Router } from "@angular/router";
import { fromPromise } from "rxjs/internal/observable/innerFrom";

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
            tap((action: { login: string, password: string }) => {
                this.userService.loginUser(action.login, action.password);
                this.router.navigate(['menu']);
            }),
            map(() => UserActions.userLoginSuccess())
        )
    });
}
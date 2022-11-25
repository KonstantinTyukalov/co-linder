import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { UserService } from "../../services/user.service";
import * as UserActions from "../actions/user.actions";
import { from, tap } from "rxjs";
import { mergeMap, map } from 'rxjs/operators'
import { User } from "../../dto/user.dto";
import { registrationUserSuccess } from "../actions/user.actions";

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private userService: UserService) {

    }

    registrationUser$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(UserActions.registrationUser),
            tap((action: { user: User }) => {
                this.userService.registerUser(action.user);
            }),
            map(() => {
                return UserActions.registrationUserSuccess()
            })
        );
    });
}
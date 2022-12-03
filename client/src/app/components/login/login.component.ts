import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as UserActions from '../../store/actions/user.actions';
import { isUserLoading, userError } from '../../store/selectors/user.selectors';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
    public login: string = '';
    public password: string = '';

    public isUserLoading?: boolean;
    public userError?: Error;

    private readonly subscriptions = new Subscription();

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {
    }

    public ngOnInit() {
        this.subscriptions.add(
            this.store.select(isUserLoading).subscribe((loading) => {
                this.isUserLoading = loading;
            })
        );
        this.subscriptions.add(
            this.store.select(userError).subscribe((err) => {
                this.userError = err;
            })
        );
    }

    public doLogin() {
        this.store.dispatch(UserActions.userLogin({
            login: this.login,
            password: this.password
        }));
    }

    public redirectToRegistration() {
        this.router.navigate(['registration']);
    }

    public onOkClick() {
        this.store.dispatch(UserActions.clearUserError());
    }

    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}

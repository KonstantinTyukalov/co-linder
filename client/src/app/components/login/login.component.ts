import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";
import * as UserActions from '../../store/actions/user.actions'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
    public login: string = '';
    public password: string = '';

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {
    }

    public doLogin() {
        this.store.dispatch(UserActions.userLogin({ login: this.login, password: this.password }));
        this.router.navigate(['menu']);
    }

    public redirectToRegistration() {
        this.router.navigate(['registration']);
    }
}

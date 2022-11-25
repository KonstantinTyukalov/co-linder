import { Component } from '@angular/core';
import { Store } from "@ngrx/store";
import { Router } from "@angular/router";

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

    public redirectToRegistration() {
        
    }
}

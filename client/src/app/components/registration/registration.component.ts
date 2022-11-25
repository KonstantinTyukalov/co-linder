import { Component } from '@angular/core';
import { User } from "../../dto/user.dto";
import { Store } from "@ngrx/store";
import { COUNTRIES } from "../../utils/countries";
import * as UserActions from "../../store/actions/user.actions";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    public countries = COUNTRIES;

    public newUser: User = {
        email: '',
        password: '',
        name: '',
        age: 0,
        country: '',
        isWoman: true,
        languages: '',
        description: ''
    };

    constructor(private readonly store: Store) {

    }

    public registration() {
        this.store.dispatch(UserActions.registrationUser({ user: this.newUser }));
    }

    public inputLanguages(event: string) {
        this.newUser.languages = event;
    }
}

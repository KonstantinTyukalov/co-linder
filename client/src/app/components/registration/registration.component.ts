import { Component } from '@angular/core';
import { User } from "../../dto/user.dto";
import { Store } from "@ngrx/store";

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    public aboba = ['Moscow', 'London', 'Paris']

    public newUser: User = {
        email: '',
        password: '',
        name: '',
        age: 0,
        country: '',
        isWoman: true,
        languages: ''
    };

    constructor(private readonly store: Store) {
    }

    public nameChanged(event: Event) {
        console.log(this.newUser);
    }
}

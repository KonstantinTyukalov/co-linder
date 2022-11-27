import { Component } from '@angular/core';
import { User } from '../../dto/user.dto';
import { Store } from '@ngrx/store';
import { COUNTRIES } from '../../utils/countries';
import * as UserActions from '../../store/actions/user.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    public countries = COUNTRIES;
    private avatarForUpload?: File;

    public newUser: User = {
        email: '',
        avatar: '',
        password: '',
        name: '',
        age: NaN,
        country: '',
        isWoman: null,
        languages: '',
        description: ''
    };

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {

    }

    public descriptionshanged(event: string) {
        this.newUser.description = event;
        console.log(this.newUser);
    }

    public picPhoto(e: Event) {
        const files = (<HTMLInputElement> e.target).files;
        this.avatarForUpload = files ? files[0] : undefined;
    }

    public registration() {
        const user = { ...this.newUser };
        this.store.dispatch(UserActions.registrationUser({ user, file: this.avatarForUpload }));
        this.router.navigate(['login']);
    }

    public inputLanguages(event: string) {
        this.newUser.languages = event;
    }
}

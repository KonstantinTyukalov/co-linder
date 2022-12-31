import { Component } from '@angular/core';
import { User } from '@dto/user.dto';
import { Store } from '@ngrx/store';
import { COUNTRIES } from '@utils/countries';
import * as UserActions from '@store/actions/user.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-registration',
    templateUrl: './registration.component.html',
    styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent {
    public countries = COUNTRIES;
    public imagePath: string = '';

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

    private avatarForUpload?: File;

    constructor(
        private readonly store: Store,
        private readonly router: Router
    ) {}

    public picPhoto(e: Event) {
        const reader = new FileReader();

        reader.onload = (event: any) => {
            console.log(event);
            this.imagePath = event.target.result;
        };

        const files = (<HTMLInputElement> e.target).files;

        if (files?.[0]) {
            this.avatarForUpload = files[0];
            reader.readAsDataURL(this.avatarForUpload!);
        }
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

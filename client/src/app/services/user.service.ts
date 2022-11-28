import { Injectable } from '@angular/core';
import { User } from 'src/app/dto/user.dto';
import { PocketBaseService, STATIC_PATH } from './pb.service';
import { UserPb } from '../models/user.model.pb';


export const ghostUser: User = {
    email: 'no@mail.com',
    age: 2000,
    name: 'Ghost',
    avatar: '',
    isWoman: false,
    country: 'No country',
}

@Injectable()
export class UserService {
    readonly COOKIE_FOR_AUTH_DATA = 'pb_authData';

    constructor(private readonly pbService: PocketBaseService) {
    }

    async registerUser(userDto: User, userAvatar?: File) {
        const newUserFormData = new FormData();

        // example create data
        const langs = userDto.languages!.split(',').map(s => s.trim());

        if (userAvatar) newUserFormData.append('avatar', userAvatar);
        newUserFormData.append('email', userDto.email);
        newUserFormData.append('emailVisibility', true.toString());

        newUserFormData.append('password', userDto.password!);
        newUserFormData.append('passwordConfirm', userDto.password!);
        newUserFormData.append('name', userDto.name);
        newUserFormData.append('birthDate', new Date().toString());
        newUserFormData.append('isWoman', (userDto.isWoman ?? false).toString());
        newUserFormData.append('country', userDto.country ?? '');
        newUserFormData.append('langs', JSON.stringify(langs));
        newUserFormData.append('hasPets', false.toString());
        newUserFormData.append('aboutMyself', userDto.description ?? '');

        console.log('Sending new user:', JSON.stringify(newUserFormData));

        const record = await this.pbService.getCollection('users').create(newUserFormData);

        console.log('Record created', record);

        // (optional) send an email verification request
        const isVerified = await this.pbService.getCollection('users').requestVerification(userDto.email);

        console.log('Email to verify sended:', isVerified);
    }

    async loginUser(login: string, password: string): Promise<User> {
        try {
            const authData = await this.pbService.getCollection('users').authWithPassword(
                login,
                password
            );

            const loggedInUser = authData.record as unknown as User;
            // pb.authStore.save(authData.token, authData.record);
            // pb.authStore.exportToCookie({httpOnly:false}, this.COOKIE_FOR_AUTH_DATA)

            console.log('User logged in. Data: ', authData);

            return expandAvatar(loggedInUser);
        } catch (err) {
            throw new Error('With login: ' + login + ' Login Error: ' + err);
        }
    }

    logoutUser() {
        this.pbService.Logout();
    }

    async getUserById(id: string): Promise<User> {
        console.log('Trying to get user by id:', id);
        return await this.pbService.getCollection('users').getOne(id);
    }
}

export function expandAvatar(user: User | UserPb): User {

    user.avatar = user?.avatar ? STATIC_PATH + 'users/' + user.id + '/' + user.avatar : undefined;

    return user;
}

import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { PocketBaseService } from "./pb.service";

@Injectable()
export class UserService {
    constructor(private pbService: PocketBaseService) {
    }

    async registerUser(userDto: User) {
        // example create data
        const langs = userDto.languages.split(',').map(s => s.trim());

        const data = {
            "email": userDto.email,
            "avatar": userDto.avatar,
            "emailVisibility": true,
            "password": userDto.password,
            "passwordConfirm": userDto.password,
            "name": userDto.name,
            "birthDate": new Date(),
            "isWoman": userDto.isWoman,
            "country": userDto.country,
            "langs": langs,
            "hasPets": false,
            "aboutMyself": userDto.description
        };

        console.log('Sending new user:', data);

        const record = await this.pbService.PocketBaseInstance.collection('users').create(data);

        console.log('Record created', record);

        // (optional) send an email verification request
        const isVerified = await this.pbService.PocketBaseInstance.collection('users').requestVerification(userDto.email);

        console.log("Email to verify sended:", isVerified)
    }

    async loginUser(login: string, password: string) {
        try {
            const authData = await this.pbService.PocketBaseInstance.collection('users').authWithPassword(
                login,
                password
            );

            console.log("User logged in. Data: ", authData)

            // after the above you can also access the auth data from the authStore
            console.log(this.pbService.PocketBaseInstance.authStore.isValid);
            console.log(this.pbService.PocketBaseInstance.authStore.token);
        } catch (err) {
            throw new Error("With login: " + login + " Login Error: " + err)
        }
    }

    logoutUser() {
        this.pbService.Logout();
    }

    async getUserById(id: string): Promise<User> {
        console.log('Trying to get user by id:', id);
        return await this.pbService.PocketBaseInstance.collection('users').getOne(id);
    }
}

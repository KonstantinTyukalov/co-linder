import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { pbService } from "./pb.service";

@Injectable()
export class UserService {
    constructor() {
    }

    async registerUser(userDto: User) {

        // example create data
        const langs = userDto.languages.split(',').map(s => s.trim());

        const data = {
            "email": userDto.email,
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

        const record = await pbService.PocketBaseInstance.collection('users').create(data);

        console.log('Record created', record);

        // (optional) send an email verification request
        const isVerified = await pbService.PocketBaseInstance.collection('users').requestVerification(userDto.email);

        console.log("Email to verify sended:", isVerified)
    }

    async loginUser(userDto: User) {

        try {

            const authData = await pbService.PocketBaseInstance.collection('users').authWithPassword(
                userDto.email,
                userDto.password,
            );

            console.log("User logged in. Data: ", authData)

            // after the above you can also access the auth data from the authStore
            console.log(pbService.PocketBaseInstance.authStore.isValid);
            console.log(pbService.PocketBaseInstance.authStore.token);
        }
        catch (err) {
            throw new Error("With this data: " + userDto + " Login Error: " + err)
        }
    }

    async logoutUser() {
        await pbService.Logout();
    }
}

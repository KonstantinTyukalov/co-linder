import { Injectable } from "@angular/core";
import { User } from "src/app/dto/user.dto";
import { PocketBaseService, STATIC_PATH } from "./pb.service";
import { environment } from "../../environments/environment";

@Injectable()
export class UserService {
    readonly COOKIE_FOR_AUTH_DATA = "pb_authData"

    constructor(private pbService: PocketBaseService) {
    }

    async registerUser(userDto: User, userAvatar: File) {

        const newUserFormData = new FormData();

        // example create data
        const langs = userDto.languages!.split(',').map(s => s.trim());

        newUserFormData.append('avatar', userAvatar)
        newUserFormData.append("email", userDto.email)
        newUserFormData.append("emailVisibility", true.toString())

        newUserFormData.append("password", userDto.password!)
        newUserFormData.append("passwordConfirm", userDto.password!)
        newUserFormData.append("name", userDto.name)
        newUserFormData.append("birthDate", new Date().toString())
        newUserFormData.append("isWoman", userDto.isWoman!.toString())
        newUserFormData.append("country", userDto.country!)
        newUserFormData.append("langs", JSON.stringify(langs))
        newUserFormData.append("hasPets", false.toString())
        newUserFormData.append("aboutMyself", userDto.description!)

        console.log('Sending new user:', newUserFormData);

        const record = await this.pbService.getCollection('users').create(newUserFormData);

        console.log('Record created', record);

        // (optional) send an email verification request
        const isVerified = await this.pbService.getCollection('users').requestVerification(userDto.email);

        console.log("Email to verify sended:", isVerified)
    }

    async loginUser(login: string, password: string): Promise<User> {
        try {
            const pb = this.pbService.PocketBaseInstance;
            const authData = await pb.collection('users').authWithPassword(
                login,
                password
            );

            const loggedInUser = authData.record as unknown as User
            // pb.authStore.save(authData.token, authData.record);
            // pb.authStore.exportToCookie({httpOnly:false}, this.COOKIE_FOR_AUTH_DATA)

            console.log("User logged in. Data: ", authData)

            // after the above you can also access the auth data from the authStore
            // console.log(pb.authStore.isValid);
            // console.log(pb.authStore.token);

            return expandAvatar(loggedInUser);
        } catch (err) {
            throw new Error("With login: " + login + " Login Error: " + err)
        }
    }

    loadFromCookeis() {
        // const pb = this.pbService.PocketBaseInstance;
        // const authData = window.localStorage["pocketbase_auth"]
        // // const value = `; ${document.cookie}`;
        // // const parts = value.split(`; ${this.COOKIE_FOR_AUTH_DATA}=`);
        // // let authData: string;
        // // if (parts.length === 2) {
        // //     authData = parts!.pop()!.split(';').shift()!;
        // if (authData) {
        //     pb.authStore.loadFromCookie(authData);
        //     console.log('Got login info from cookies:', pb.authStore);
        //     return;
        // }
        console.log("Can't find cookies by", this.COOKIE_FOR_AUTH_DATA);
    }

    logoutUser() {
        this.pbService.Logout();
    }

    async getUserById(id: string): Promise<User> {
        console.log('Trying to get user by id:', id);
        return await this.pbService.getCollection('users').getOne(id);
    }
}

export function expandAvatar(user: User): User {
    if (user === undefined) {
        return user;
    }
    user.avatar = user?.avatar ? STATIC_PATH + "users/" + user.id + "/" + user.avatar : undefined;
    return user;
}

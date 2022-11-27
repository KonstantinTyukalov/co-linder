import { BaseModelPb } from "./base.model.pb";

export interface UserPb extends BaseModelPb {
    username: string;
    email: string;
    emailVisibility: boolean;
    password: string;
    passwordConfirm: string;
    name: string;
    birthDate: Date;
    isWoman: boolean;
    country: string;
    langs: string;
    hasPets: boolean;
    aboutMyself: string;
}

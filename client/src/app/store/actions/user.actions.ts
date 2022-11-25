import { createAction, props } from "@ngrx/store";
import { User } from "../../dto/user.dto";

export const registrationUser = createAction('REGISTRATION_USER', props<{ user: User }>());

export const registrationUserSuccess = createAction('REGISTRATION_USER_SUCCESS');
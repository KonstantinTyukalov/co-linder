import { createAction, props } from '@ngrx/store';
import { User } from '../../dto/user.dto';

export const registrationUser = createAction('REGISTRATION_USER', props<{ user: User; file?: File; }>());
export const registrationUserSuccess = createAction('REGISTRATION_USER_SUCCESS');

export const userLogin = createAction('USER_LOGIN', props<{ login: string; password: string; }>());
export const userCreateOrUpdateInStore = createAction('USER_LOGIN_SUCCESS', props<{ user: User; }>());

export const userLoading = createAction('USER_LOADING');
export const userError = createAction('USER_ERROR', props<{ error: Error; }>());
export const clearUserError = createAction('CLEAR_USER_ERROR');

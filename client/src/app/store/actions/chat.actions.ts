import { createAction, props } from "@ngrx/store";
import { Chat } from "../../dto/chat.dto";

export const getChatById = createAction('GET_CHAT_BY_ID', props<{ id: string }>());
export const getChatByIdSuccess = createAction('GET_CHAT_BY_ID_SUCCESS', props<{ chat: Chat }>());

export const getChatsByUserId = createAction('GET_CHATS_BY_USER_ID', props<{ id: string }>());
export const getChatsByUserIdSuccess = createAction('GET_CHATS_BY_USER_ID_SUCCESS', props<{ chats: Chat[] }>());

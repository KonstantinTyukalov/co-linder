import { createAction, props } from "@ngrx/store";
import { Chat } from "../../dto/chat.dto";

export const getChats = createAction('GET_CHATS');
export const getChatsSuccess = createAction('GET_CHATS_SUCCESS', props<{ chats: Chat[] }>());

export const getChatById = createAction('GET_CHAT_BY_ID', props<{ id: string }>());
export const getChatByIdSuccess = createAction('GET_CHAT_BY_ID_SUCCESS', props<{ chat: Chat }>());

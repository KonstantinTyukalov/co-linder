import { createAction, props } from "@ngrx/store";
import { Chat } from "../../dto/chat.dto";
import { ChatMessage } from "../../dto/chatMessage.dto";

export const getChatById = createAction('GET_CHAT_BY_ID', props<{ userId: string }>());
export const getChatByIdSuccess = createAction('GET_CHAT_BY_ID_SUCCESS', props<{ chat: Chat }>());

export const getChatsByUserId = createAction('GET_CHATS_BY_USER_ID', props<{ id: string }>());
export const getChatsByUserIdSuccess = createAction('GET_CHATS_BY_USER_ID_SUCCESS', props<{ chats: Chat[] }>());

export const goToChatById = createAction('GO_TO_CHAT_BY_ID', props<{ userId: string }>());
export const goToChatByIdSuccess = createAction('GO_TO_CHAT_BY_ID_SUCCESS', props<{ chat: Chat }>());

export const updateChat = createAction('UPDATE_CHAT', props<{ chatMessage: ChatMessage }>());

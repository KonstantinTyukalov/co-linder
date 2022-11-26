import { Chat } from '../../dto/chat.dto';
import { createReducer, on } from '@ngrx/store';
import * as ChatsActions from '../actions/chat.actions';
import { ChatMessage } from "../../dto/chatMessage.dto";

export interface ChatsState {
    chats: Chat[];
    currentChat?: Chat;
    chatNotFoundErr?: string;
}

export const initialState: ChatsState = {
    chats: [],
};

export const reducer = createReducer(
    initialState,
    on(ChatsActions.getChatsByUserIdSuccess, (state, { chats }) => ( { ...state, chats } )),
    on(ChatsActions.getChatByIdSuccess, (state, { chat }) => ( { ...state, currentChat: chat } )),
    on(ChatsActions.updateChat, (state, { chatMessage }) => {
        const messages = state.currentChat?.messages;
        messages?.push(chatMessage);
        return {
            ...state, currentChat: { ...state.currentChat, messages: messages }
        }
    }),
);

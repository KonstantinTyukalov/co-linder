import { Chat } from '../../dto/chat.dto';
import { createReducer, on } from '@ngrx/store';
import * as ChatsActions from '../actions/chat.actions';

export interface ChatsState {
    chats: Chat[];
    currentChat?: Chat;
    chatNotFoundErr?: string;
}

export const initialState: ChatsState = {
    chats: []
};

export const reducer = createReducer(
    initialState,
    on(ChatsActions.getAllChatsByUserIdSuccess, (state, { chats }) => ({ ...state, chats })),
    on(ChatsActions.getChatByIdSuccess, (state, { chat }) => ({ ...state, currentChat: chat })),
    on(ChatsActions.updateChatMessages, (state, { lastChatMessage }) => {
        const messages = state.currentChat?.messages ?? [];

        if (!messages.find(msg => msg.id === lastChatMessage.id)) {
            messages.push(lastChatMessage);
        }

        return {
            ...state, currentChat: { ...state.currentChat, messages }
        };
    })
);

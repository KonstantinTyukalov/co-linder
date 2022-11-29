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
    on(ChatsActions.addMessageToCurrentChat, (state, { lastChatMessage }) => ({
        ...state,
        currentChat: {
            ...state.currentChat,
            messages: [...(state.currentChat!.messages ?? []), lastChatMessage]
        }
    }))
);

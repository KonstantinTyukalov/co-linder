import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ChatsState } from '../reducers/chat.reducer';

export const state = createFeatureSelector<ChatsState>('CHAT_STATE');

export const chats = createSelector(state, state => state.chats);

export const chat = createSelector(state, state => state.currentChat);

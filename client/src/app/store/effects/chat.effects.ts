import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';

import { Chat } from '@dto/chat.dto';
import { ChatService } from '@services/chat.service';

import * as ChatActions from '../actions/chat.actions';

@Injectable()
export class ChatEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly chatService: ChatService
    ) {
    }

    getAllChatsByUserId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ChatActions.getAllChatsByUserId),
            switchMap((action: { id: string; }) => {
                return from(this.chatService.getAllChatsByUserId(action.id));
            }),
            map((chats: Chat[]) => {
                return ChatActions.getAllChatsByUserIdSuccess({ chats });
            })
        );
    });

    getChatById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ChatActions.getChatById),
            switchMap((action: { chatId: string; }) => {
                return from(this.chatService.getChatById(action.chatId));
            }),
            map((chat: Chat) => {
                return ChatActions.getChatByIdSuccess({ chat });
            })
        );
    });
}

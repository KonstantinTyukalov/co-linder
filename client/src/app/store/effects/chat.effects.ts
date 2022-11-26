import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { ChatService } from '../../services/chat.service';
import * as ChatActions from '../actions/chat.actions';
import { from, switchMap } from "rxjs";
import { map } from "rxjs/operators";
import { Chat } from "src/app/dto/chat.dto";
import { Store } from "@ngrx/store";

@Injectable()
export class ChatEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly chatService: ChatService,
        private readonly store: Store
    ) {
    }

    getChatsByUserId$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ChatActions.getChatsByUserId),
            switchMap((action: { id: string }) => {
                return from(this.chatService.getChatsByUserId(action.id));
            }),
            map((chats: Chat[]) => {
                return ChatActions.getChatsByUserIdSuccess({ chats });
            })
        )
    })

    getChatById$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(ChatActions.getChatById),
            switchMap((action: { userId: string }) => {
                return from(this.chatService.getChatWithMessageSendersAvatars(action.userId!))
            }),
            map((chat: Chat) => {
                return ChatActions.getChatByIdSuccess({ chat });
            })
        )
    })

    // goToChatById$ = createEffect(() => {
    //     return this.actions$.pipe(
    //         ofType(ChatActions.getChatById),
    //         switchMap((action: { userId: string }) => {
    //             return from(this.chatService.tryGetChatWithUser(action.userId!))
    //         }),
    //         map((chat: Chat) => {
    //             return ChatActions.getChatByIdSuccess({ chat });
    //         })
    //     )
    // })
}

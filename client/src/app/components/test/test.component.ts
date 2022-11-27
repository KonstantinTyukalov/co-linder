import { Component, OnInit } from '@angular/core';
import { User } from '../../dto/user.dto';
import { FlatService } from '../../services/flat.service';
import { ChatService } from 'src/app/services/chat.service';
import { ChatMessage } from 'src/app/dto/chatMessage.dto';
import { Chat } from 'src/app/dto/chat.dto';
import { user1, user2 } from './testUsers';

@Component({
    selector: 'app-hero-list',
    templateUrl: './test.component.html',
    providers: [FlatService]
})
export class TestComponent implements OnInit {
    // public countries = COUNTRIES;

    public newUser: User = {
        avatar: '',
        email: '',
        password: '',
        name: '',
        age: 0,
        country: '',
        isWoman: true,
        languages: '',
        description: ''
    };

    constructor(private readonly chatService: ChatService, private readonly flatService: FlatService) { }

    public ngOnInit() {
        // this.flatService.getFlats().then(flats => {
        //     console.log("got flats", flats)
        // });

        // this.sendMessageTest();
        // this.testGettingChats()
    }

    private testGettingChats() {
        this.chatService.getChatsByUserId(user1.id!);
    }

    private sendMessageTest() {
        const chat: Chat = {
            messages: [],
            users: [user1, user2],
            id: 'sou3qc79a3s2ycw'
        };
        const message: ChatMessage = {
            chat,
            content: 'Wassup',
            sender: user1
        };

        this.chatService.sendMessage(message);
    }

    private TestCreatingTheChat() {
        this.chatService.createChatWithUser(user1, user2);
    }
}

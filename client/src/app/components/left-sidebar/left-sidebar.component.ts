import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../dto/user.dto';
import { Chat } from '../../dto/chat.dto';
import { Location } from '@angular/common';

@Component({
    selector: 'app-left-sidebar',
    templateUrl: './left-sidebar.component.html',
    styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
    @Input() user$!: Observable<User | undefined>;
    @Input() chats$!: Observable<Chat[]>;

    constructor(private readonly location: Location) {
    }

    ngOnInit(): void {
    }

    public onBackClick(): void {
        this.location.back();
    }
}

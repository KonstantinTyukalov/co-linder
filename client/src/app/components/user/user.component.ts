import { Component, Input, OnInit } from '@angular/core';
import { Observable } from "rxjs";
import { User } from "../../dto/user.dto";

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent {
    @Input() user$!: Observable<User | undefined>

    constructor() {
    }

}

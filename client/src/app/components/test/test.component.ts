import { Component, OnInit } from '@angular/core';
import { User } from "../../dto/user.dto";
import { Flat } from "../../dto/flat.dto";
import { FlatService } from "../../services/flat.service";

@Component({
    selector: 'app-hero-list',
    templateUrl: './test.component.html',
    providers: [FlatService]
})
export class TestComponent implements OnInit {
    //public countries = COUNTRIES;

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

    constructor(private flatService: FlatService) {
    }

    public ngOnInit() {
        this.flatService.getFlats().then(flats => {
            console.log("got flats", flats)
        });
    }
}

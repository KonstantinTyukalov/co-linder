import { Component, OnInit } from '@angular/core';
import { Store } from "@ngrx/store";

@Component({
    selector: 'app-apartments',
    templateUrl: './apartments.component.html',
    styleUrls: ['./apartments.component.scss']
})
export class ApartmentsComponent implements OnInit {

    constructor(private readonly store: Store) {
    }

    ngOnInit(): void {
    }

}

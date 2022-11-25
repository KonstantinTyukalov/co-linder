import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-flat',
    templateUrl: './flat.component.html',
    styleUrls: ['./flat.component.scss']
})
export class FlatComponent implements OnInit {
    ///private flat$ = this.store.select()

    constructor() {
    }

    ngOnInit(): void {
        ///this.store.dispatch();
    }

}

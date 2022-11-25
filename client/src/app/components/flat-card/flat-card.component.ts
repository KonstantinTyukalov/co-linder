import { Component, Input, OnInit } from '@angular/core';
import { Flat } from "../../dto/flat.dto";
import { Router } from "@angular/router";

@Component({
    selector: 'app-flat-card',
    templateUrl: './flat-card.component.html',
    styleUrls: ['./flat-card.component.scss']
})
export class FlatCardComponent implements OnInit {
    @Input() flat!: Flat;

    constructor(private readonly router: Router) {

    }

    ngOnInit(): void {

    }

    public onClick() {
        this.router.navigate(['flat', this.flat.id]);
    }
}

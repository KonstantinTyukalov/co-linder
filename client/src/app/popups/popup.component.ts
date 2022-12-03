import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-popups',
    templateUrl: './popup.component.html',
    styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
    @Output() pidop = new EventEmitter<boolean>();

    ngOnInit(): void {
    }

    onClickOk() {
        this.pidop.emit(false);
    }
}

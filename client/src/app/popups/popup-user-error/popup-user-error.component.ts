import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-popup-user-error',
    templateUrl: './popup-user-error.component.html',
    styleUrls: ['./popup-user-error.component.scss']
})
export class PopupUserErrorComponent {
    @Input() error!: Error;
    @Output() onOkClick = new EventEmitter<null>();
}

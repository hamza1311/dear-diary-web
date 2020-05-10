import {Component, Input, OnInit} from '@angular/core';
import {DiaryItem} from '../../models/DiaryItem';

@Component({
    selector: 'app-show-item-card',
    templateUrl: './show-item-card.component.html',
    styleUrls: ['./show-item-card.component.scss']
})
export class ShowItemCardComponent implements OnInit {
    @Input() item: DiaryItem

    constructor() {}

    ngOnInit(): void {}

}

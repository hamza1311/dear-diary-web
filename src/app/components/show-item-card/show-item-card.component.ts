import { Component, Input, OnInit } from '@angular/core'
import { DiaryItem } from '../../models/DiaryItem'
import { BreakpointObserver } from '@angular/cdk/layout'

@Component({
    selector: 'app-show-item-card',
    templateUrl: './show-item-card.component.html',
    styleUrls: ['./show-item-card.component.scss']
})
export class ShowItemCardComponent implements OnInit {
    @Input() item: DiaryItem

    constructor(private breakpointObserver: BreakpointObserver) { }

    ngOnInit(): void { }

    get itemContent() {
        const isSmallScreen = this.breakpointObserver.isMatched('(max-width: 600px)')
        const size = isSmallScreen ? 100 : 450
        return this.item.content.length > size ? this.item.content.substr(0, size) + '...' : this.item.content
    }
}

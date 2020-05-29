/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { DiaryService } from '../../services/diary.service'
import { map } from 'rxjs/operators'
import { DiaryItem } from '../../models/DiaryItem'
/* eslint-enable no-unused-vars */

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    items;

    // eslint-disable-next-line no-unused-vars
    constructor(private router: Router, private diaryService: DiaryService) { }

    async ngOnInit() {
        const ref = await this.diaryService.getAllItems()
        this.items = ref.snapshotChanges().pipe(
            map(docs => docs.map(doc =>{
                const data = doc.payload.doc.data() as DiaryItem
                const id = doc.payload.doc.id
                return { id, ...data }
            }))
        )
    }
}

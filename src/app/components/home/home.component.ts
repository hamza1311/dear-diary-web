import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'
import { DiaryService } from '../../services/diary.service'
import { map } from 'rxjs/operators'
import { DiaryItem } from '../../models/DiaryItem'

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    items;

    constructor(private router: Router, private diaryService: DiaryService) {
    }

    async ngOnInit() {
        const ref = await this.diaryService.getAllItems()
        this.items = ref.snapshotChanges().pipe(map(docs => docs.map(doc =>{
            const data = doc.payload.doc.data() as DiaryItem
            const id = doc.payload.doc.id
            return { id, ...data }
        })))
        // ref.valueChanges({ idField: 'yeah' }).subscribe(items => {
        //     this.items = items
        // })
    }

}

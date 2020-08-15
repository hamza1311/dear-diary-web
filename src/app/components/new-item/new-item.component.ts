/* eslint-disable no-unused-vars */
import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DiaryService } from '../../services/diary.service'
import { DiaryItemWithId } from '../../models/DiaryItem'
import { MatSnackBar } from '@angular/material/snack-bar'
/* eslint-enable no-unused-vars */

@Component({
    selector: 'app-new-item',
    templateUrl: './new-item.component.html',
    styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {
    item: DiaryItemWithId;
    private isNew = false

    // eslint-disable-next-line no-unused-vars
    constructor(private activatedRoute: ActivatedRoute, private diaryService: DiaryService, private router: Router, private snackBar: MatSnackBar) {
    }

    ngOnInit(): void {
        const snapshot = this.activatedRoute.snapshot
        this.isNew = snapshot.url[0].path === 'new'
        if (this.isNew) {
            this.item = { title: '', content: '', id: '', createdAt: undefined }
        } else {
            const id = snapshot.paramMap.get('id')
            this.diaryService.getItem(id).then(item => {
                if (!item) {
                    alert('Item not found')
                }
                this.item = item
            })
        }
    }

    async save() {
        if (this.isNew) {
            await this.diaryService.createItem(this.item.title, this.item.content)
            this.snackBar.open('Successfully saved', undefined, { duration: 2000 })
        } else {
            await this.diaryService.updateItem(this.item.id, this.item.title, this.item.content)
            this.snackBar.open('Successfully edited', undefined, { duration: 2000 })
        }
        await this.router.navigateByUrl('/')
    }

}

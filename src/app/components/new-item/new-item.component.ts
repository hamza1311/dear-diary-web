import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { DiaryService } from '../../services/diary.service'
import { DiaryItemWithId } from '../../models/DiaryItem'

@Component({
    selector: 'app-new-item',
    templateUrl: './new-item.component.html',
    styleUrls: ['./new-item.component.scss']
})
export class NewItemComponent implements OnInit {
  item: DiaryItemWithId;
  private isNew = false

  constructor(private activatedRoute: ActivatedRoute, private diaryService: DiaryService, private router: Router) {
  }

  ngOnInit(): void {
      const snapshot = this.activatedRoute.snapshot
      this.isNew = snapshot.url[0].path === 'new'
      if (this.isNew) {
          this.item = { title: '', content: '', id: '', createdAt: undefined }
      } else {
          const id = snapshot.paramMap.get('id')
          console.log(id)
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
          console.log(this.item)
          await this.diaryService.createItem(this.item.title, this.item.content)
      } else {
          await this.diaryService.updateItem(this.item.id, this.item.title, this.item.content)
      }
      await this.router.navigateByUrl('/home')
  }

}

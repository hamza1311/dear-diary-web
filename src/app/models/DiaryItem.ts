// eslint-disable-next-line no-unused-vars
import { firestore } from 'firebase'

export class DiaryItem {
    constructor(
        public title: string,
        public content: string,
        public createdAt: Date,
    ) {}
}

export type DiaryItemWithId = DiaryItem & { id: string }

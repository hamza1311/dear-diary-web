/* eslint-disable no-unused-vars */
export class DiaryItem {
    constructor(
        public title: string,
        public content: string,
        public createdAt: Date,
    ) {}
}

export type DiaryItemWithId = DiaryItem & { id: string }

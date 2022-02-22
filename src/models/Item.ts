import {Timestamp} from "firebase/firestore";

export interface Item {
    title: string
    content: string
    createTime: Timestamp
    updateTime: Timestamp | null
    author: string
    isShared: boolean
}

export type ItemWithId = Item & { id: string }

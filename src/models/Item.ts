import {Timestamp} from "firebase/firestore";
import {User} from "./User";

export interface Item {
    title: string
    content: string
    createTime: Timestamp
    updateTime: Timestamp | null
    author: string | User
    isShared: boolean
}

export type ItemWithId = Item & { id: string }

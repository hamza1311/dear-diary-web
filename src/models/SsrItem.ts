import {ItemWithId} from "./Item";
import {User} from "./User";
import {Timestamp} from 'firebase/firestore'

export interface SSRItem {
    id: string
    title: string
    content: string
    createTime: string
    updateTime: string | null
    author: User
    isShared: boolean
}

export const itemFromSSRItem = (ssrItem: SSRItem): ItemWithId => {
    return {
        id: ssrItem.id,
        title: ssrItem.title,
        content: ssrItem.content,
        createTime: Timestamp.fromMillis(Date.parse(ssrItem.createTime)),
        updateTime: ssrItem.updateTime ? Timestamp.fromMillis(Date.parse(ssrItem.updateTime)) : null,
        author: ssrItem.author,
        isShared: ssrItem.isShared
    }
}

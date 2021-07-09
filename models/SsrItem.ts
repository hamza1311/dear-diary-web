import {ItemWithId} from "./Item";
import firebase from "firebase/app";

export interface SSRItem {
    id: string
    title: string
    content: string
    createTime: string
    updateTime: string | null
    author: string
    isShared: boolean
}

export const itemFromSSRItem = (ssrItem: SSRItem): ItemWithId => {
    return {
        id: ssrItem.id,
        title: ssrItem.title,
        content: ssrItem.content,
        createTime: firebase.firestore.Timestamp.fromMillis(Date.parse(ssrItem.createTime)),
        updateTime: ssrItem.updateTime ? firebase.firestore.Timestamp.fromMillis(Date.parse(ssrItem.updateTime)) : null,
        author: ssrItem.author,
        isShared: ssrItem.isShared
    }
}

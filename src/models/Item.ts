import firebase from "firebase/app";
import "firebase/firestore";

export interface Item {
    title: string
    content: string
    createTime: firebase.firestore.Timestamp
    updateTime: firebase.firestore.Timestamp | null
    author: string
    isShared: boolean
}

export type ItemWithId = Item & { id: string }

import firebase from "firebase/app";
import "firebase/firestore";

export interface QuickieCategory {
    author: string,
    name: string,
    createTime: firebase.firestore.Timestamp
}

export type QuickieCategoryWithId = QuickieCategory & { id: string }

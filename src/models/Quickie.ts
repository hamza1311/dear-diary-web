import firebase from "firebase/app";
import "firebase/firestore";

export interface Quickie {
    content: string,
    createTime: firebase.firestore.Timestamp
}

export type QuickieWithId = Quickie & { id: string }

import {getFirestore, collection as collectionFirebase, Query, onSnapshot, DocumentData} from "firebase/firestore";
import {useEffect, useState} from "react";

export const collection = (path: string, ...pathSegments: string[]) => collectionFirebase(getFirestore(), path, ...pathSegments)

type WithId<T> = T & { id: string };

export function useQuerySnapshot<T>(
    query: Query,
    initialItems: () => WithId<T>[],
    docToT: (data: DocumentData) => T,
) {
    const [items, setItems] = useState<WithId<T>[]>(initialItems)
    useEffect(() => {
        return onSnapshot(query, (snapshot) => {
            const docs = snapshot.docs.map(it => {
                const data = docToT(it.data())
                return {
                    id: it.id,
                    ...data
                }
            })
            setItems(docs)
        })
    }, [])

    return items
}
/*
* https://firestore.googleapis.com/google.firestore.v1.Firestore/Listen/channel?database=projects%2Fdeardiary-app%2Fdatabases%2F(default)&VER=8&gsessionid=Nroaw_1JADuQZ5BBVeU0gMCgI3MQw9Q_3opCOoXBZdY&SID=xBb6YLnU0oSZOacWsi3YRg&RID=41283&AID=2274&zx=w2kwkakcaa9i&t=1
* */

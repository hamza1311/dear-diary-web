import { getFirestore, collection as collectionFirebase } from "firebase/firestore";

export const collection = (path: string, ...pathSegments: string[]) => collectionFirebase(getFirestore(), path, ...pathSegments)

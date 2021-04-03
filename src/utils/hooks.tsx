import {useFirestore, useFirestoreDocData} from "reactfire";
import {ItemWithId} from "../models/Item";
import useMediaQuery from "@material-ui/core/useMediaQuery";

export const useItemsCollection = () => {
    return useFirestore()
        .collection('items')
}

export const useItem = (id: string) => {
    const ref = useItemsCollection()
        .doc(id);

    return useFirestoreDocData<ItemWithId>(ref, {
        idField: 'id'
    })
}

export const useIsOnMobile = () => useMediaQuery('(max-width: 600px)')

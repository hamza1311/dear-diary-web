import {GetServerSidePropsContext} from "next";
import {AuthUser, getFirebaseAdmin} from "next-firebase-auth";
import {SSRItem} from "../models/SsrItem";

const getDocFromIdServerSide = async (context: GetServerSidePropsContext & { AuthUser: AuthUser }) => {
    const id = context.query.id?.toString() ?? undefined

    if (id === undefined) {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            }
        }
    }

    const firebase = getFirebaseAdmin()
    const firestore = firebase.firestore()
    const doc = await firestore
        .collection("items")
        .doc(id)
        .get()

    if (!doc.exists) {
        return {
            redirect: {
                destination: '/404',
                permanent: false,
            }
        }
    }
    const data = doc.data()
    // @ts-ignore
    const {updateTime, createTime, isShared, title, author, content} = data;

    const fetchedAuthor = await firestore.collection("users").doc(author).get()

    const item = {
        id: doc.id,
        content: content,
        createTime: createTime.toDate().toISOString(),
        isShared: isShared,
        title: title,
        updateTime: updateTime?.toDate()?.toISOString() ?? null,
        author: fetchedAuthor.data()?.displayName,
    } as SSRItem

    if (item.author === context.AuthUser.id || item.isShared) {
        return {
            props: {
                item
            }
        }
    } else {
        return {
            redirect: {
                destination: '/auth',
                permanent: false,
            }
        }
    }
}

export default getDocFromIdServerSide

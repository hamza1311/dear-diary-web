import 'firebase/firestore'
import {AuthAction, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {SSRItem, itemFromSSRItem} from "../../models/SsrItem";
import getDocFromIdServerSide from '../../utils/getDocFromIdServerSide';
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import React, {useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import BottomFab from "../../components/BottomFab";
import firebase from "firebase/app";
import LoadingIndicator from "../../components/LoadingIndicator"
import {useRouter} from "next/router";

const useStyles = makeStyles({
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "2em",
        padding: "3em",
    }
})


function Edit(props: { item: SSRItem }) {
    const item = itemFromSSRItem(props.item)

    const [title, setTitle] = useState(item.title)
    const [content, setContent] = useState(item.content)

    const [isSaving, setIsSaving] = useState(false)

    const classes = useStyles();

    const router = useRouter()

    const id = item.id
    const save = async () => {
        setIsSaving(true)
        const item = {
            content,
            title,
            updateTime: firebase.firestore.Timestamp.now(),
        };

        const firestore = firebase.firestore()
        await firestore.collection("items").doc(id).update(item)
        await router.push(`/${id}`)
        setIsSaving(false)
    }

    return (
        <main>
            <LoadingIndicator isVisible={isSaving} />
            <form className={classes.form} noValidate autoComplete="off">
                <TextField
                    placeholder="Title"
                    value={title}
                    disabled={isSaving}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    placeholder="Content"
                    multiline={true}
                    maxRows={6}
                    value={content}
                    disabled={isSaving}
                    onChange={(e) => setContent(e.target.value)}
                />
            </form>
            <BottomFab onClick={save} disabled={isSaving}>
                <SaveIcon/>
            </BottomFab>
        </main>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (context) => {
    return getDocFromIdServerSide(context)
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    // @ts-ignore
})(Edit)

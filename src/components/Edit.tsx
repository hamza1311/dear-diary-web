import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import React, {useEffect, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import {useItem, useItemsCollection} from "../utils/hooks";
import BottomFab from "./utils/BottomFab";
import {useHistory, useParams} from "react-router-dom";
import firebase from "firebase/app";
import LoadingIndicator from "./utils/LoadingIndicator";

const useStyles = makeStyles({
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "2em",
        padding: "3em",
    }
})

export default function Edit() {
    const history = useHistory();
    const { id } = useParams<{id: string}>()

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [isSaving, setIsSaving] = useState(false)

    const doc = useItem(id)

    useEffect(() => {
        if (doc.status === "success") {
            const { title, content } = doc.data
            setTitle(title)
            setContent(content)
        }
    }, [doc.data, doc.status])

    const classes = useStyles();

    const collection = useItemsCollection()


    const save = async () => {
        setIsSaving(true)
        const item = {
            content,
            title,
            updateTime: firebase.firestore.Timestamp.now(),
        };

        await collection.doc(id).update(item)
        history.push(`/${id}`)
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
                    rowsMax={6}
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

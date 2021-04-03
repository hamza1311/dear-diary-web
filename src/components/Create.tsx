import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import React, {useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import {useItemsCollection} from "../utils/hooks";
import {Item} from "../models/Item";
import {useUser} from "reactfire";
import firebase from "firebase/app";
import BottomFab from "./BottomFab";
import {useHistory} from "react-router-dom";

const useStyles = makeStyles({
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "2em",
        padding: "3em",
    }
})

export default function Create() {
    const history = useHistory();

    const classes = useStyles();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const collection = useItemsCollection()

    const user = useUser();

    const save = async () => {
        const item: Item = {
            author: user.data.uid,
            content: content,
            createTime: firebase.firestore.Timestamp.now(),
            updateTime: null,
            title: title,
        };

        const ret = await collection.add(item)

        history.push(`/${ret.id}`)
    }

    return (
        <main>
            <form className={classes.form} noValidate autoComplete="off">
                <TextField
                    placeholder="Title"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    placeholder="Content"
                    multiline={true}
                    rowsMax={6}
                    onChange={(e) => setContent(e.target.value)}
                />
            </form>
            <BottomFab onClick={save}>
                <SaveIcon/>
            </BottomFab>
        </main>
    )
}

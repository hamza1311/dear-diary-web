import {AuthAction, useAuthUser, withAuthUser} from "next-firebase-auth";
import React, {useState} from "react";
import {Box, TextField} from '@mui/material';
import {Item} from "../models/Item";
import BottomFab from "../components/BottomFab";
import LoadingIndicator from "../components/LoadingIndicator";
import {useRouter} from 'next/router'
import {addDoc, serverTimestamp} from "@firebase/firestore";
import {collection} from "../utils/firebase/firestore";
import Navbar from "../components/Navbar";
import SaveIcon from '@mui/icons-material/Save'

function New() {
    const router = useRouter();

    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")

    const [isSaving, setIsSaving] = useState(false)


    const user = useAuthUser();

    const save = async () => {
        if (user.id === null) {
            throw Error("unreachable")
        }

        setIsSaving(true)
        const item = {
            author: user.id,
            content: content,
            createTime: serverTimestamp(),
            updateTime: null,
            isShared: false,
            title: title,
        };

        const ret = await addDoc(collection("items"), item)

        await router.push(`/${ret.id}`)
        setIsSaving(false)
    }

    return (
        <>
            <Navbar/>
            <main>
                <LoadingIndicator isVisible={isSaving}/>
                <Box noValidate autoComplete="off" component="form" sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2em",
                    padding: "3em",
                }}>
                    <TextField
                        placeholder="Title"
                        disabled={isSaving}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <TextField
                        placeholder="Content"
                        multiline={true}
                        disabled={isSaving}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Box>
                <BottomFab onClick={save} disabled={isSaving}>
                    <SaveIcon/>
                </BottomFab>
            </main>
        </>
    )
}

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(New)

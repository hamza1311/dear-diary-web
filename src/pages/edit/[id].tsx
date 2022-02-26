import {AuthAction, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {itemFromSSRItem, SSRItem} from "../../models/SsrItem";
import getDocFromIdServerSide from '../../utils/getDocFromIdServerSide';
import SaveIcon from "@mui/icons-material/Save";
import React, {useState} from "react";
import BottomFab from "../../components/BottomFab";
import Navbar from "../../components/Navbar";
import LoadingIndicator from "../../components/LoadingIndicator"
import {useRouter} from "next/router";
import {doc, serverTimestamp, updateDoc} from "firebase/firestore";
import {collection} from "../../utils/firebase/firestore";
import {Box, TextField} from "@mui/material/";
import Head from "next/head";

interface Props { item: SSRItem }

function Edit(props: Props) {
    const item = itemFromSSRItem(props.item)

    const [title, setTitle] = useState(item.title)
    const [content, setContent] = useState(item.content)

    const [isSaving, setIsSaving] = useState(false)

    const router = useRouter()

    const id = item.id
    const save = async () => {
        setIsSaving(true)
        const item = {
            content,
            title,
            updateTime: serverTimestamp(),
        };

        await updateDoc(doc(collection("items"), id), item)
        await router.push(`/${id}`)
        setIsSaving(false)
    }

    return (
        <>
            <Head>
                <title>Editing ${item.title} | Dear Diary</title>
            </Head>
            <Navbar/>
            <main>
                <LoadingIndicator isVisible={isSaving}/>
                <Box component="form" sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "2em",
                    padding: "3em"
                }} noValidate autoComplete="off">
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
                </Box>
                <BottomFab onClick={save} disabled={isSaving}>
                    <SaveIcon/>
                </BottomFab>
            </main>
        </>
    )
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (context) => {
    return getDocFromIdServerSide(context)
})

export default withAuthUser<Props>({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Edit)

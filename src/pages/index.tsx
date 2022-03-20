import React, {useState} from "react";
import {Item} from "../models/Item";
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import {Timestamp} from "../components/Timestamp";
import AddIcon from '@mui/icons-material/Add';
import BottomFab from "../components/BottomFab";
import EditIcon from "@mui/icons-material/Edit";
import removeMd from 'remove-markdown'
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {ScreenShare, StopScreenShare} from "@mui/icons-material";
import copy from 'copy-to-clipboard';
import {useRouter} from "next/router";
import Snackbar from "../components/Snackbar";
import Link from 'next/link'
import {AuthAction, getFirebaseAdmin, useAuthUser, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {itemFromSSRItem, SSRItem} from "../models/SsrItem";
import {collection, useQuerySnapshot} from "../utils/firebase/firestore";
import {deleteDoc, doc, orderBy, query, updateDoc, where} from 'firebase/firestore'
import Navbar from "../components/Navbar";
import {Box, Card as MuiCard, CardActions as MuiCardActions, CardContent as MuiCardContent, styled} from "@mui/material";
import Head from "next/head";


const Card = styled(MuiCard)(({theme}) => ({
    minWidth: 275,
    margin: '0 auto',
    [theme.breakpoints.down("sm")]: {
        width: '90%',
    },
    [theme.breakpoints.up("sm")]: {
        width: '70%',
    },
}))

const CardContent = styled(MuiCardContent)({
    cursor: 'pointer'
})

const CardActions = styled(MuiCardActions)({
    display: "flex",
    justifyContent: "end"
})

const TimestampContainer = styled(MuiCardActions)(({theme}) => ({
    display: "flex",
    gap: '0.5em',
    [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1, 0)
    },
    [theme.breakpoints.up("sm")]: {
        flexDirection: "column",
        gap: theme.spacing(1),
    },
}))

const CONTENT_LENGTH = 255

function Home({items: initialItems}: { items: SSRItem[] }) {
    const user = useAuthUser()
    const router = useRouter()

    const itemsCollection = collection("items")

    const uid = user.id ?? ""
    const q = query(
        itemsCollection,
        where('author', '==', uid),
        orderBy('createTime', 'desc'),
    )

    const items = useQuerySnapshot<Item>(q, () => initialItems.map(itemFromSSRItem), (data) => ({
        title: data.title,
        content: data.content,
        createTime: data.createTime,
        updateTime: data.updateTime ?? null,
        author: data.author,
        isShared: data.isShared ?? false,
    }))

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const closeSnackbar = () => setSnackbarMessage("");

    const cards = items.map(item => {
        let content = item.content.trim()
        if (content.length > CONTENT_LENGTH) {
            content = `${content.slice(0, CONTENT_LENGTH - 3)}...`
        }
        content = removeMd(content)

        const onCardClick = async () => {
            console.log('id', item.id)
            await router.push(`/${item.id}`)
        }

        const onShareClicked = async () => {
            const isShared = !item.isShared
            await updateDoc(doc(itemsCollection, item.id), {isShared})
            if (isShared) {
                copy(window.location.href + item.id)
                setSnackbarMessage("Link shared to clipboard")
            } else {
                setSnackbarMessage("Stopped sharing")
            }
        }

        const onEditClicked = async () => {
            await router.push(`/edit/${item.id}`)
        }

        const onDeleteClicked = async () => {
            await deleteDoc(doc(itemsCollection, item.id))
        }

        return (
            <Card key={item.id}>
                <CardContent onClick={onCardClick}>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <Typography variant="h5" component="h2">
                            {item.title}
                        </Typography>

                        <TimestampContainer>
                            <Timestamp timestamp={item.createTime.toDate()} icon={AccessTimeIcon}/>
                            {item.updateTime &&
                                <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
                        </TimestampContainer>
                    </Box>

                    <Typography variant="body1" component="p" sx={{pt: 0.5}}>
                        {content}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton aria-label="edit" onClick={onShareClicked}>
                        {item.isShared ? <StopScreenShare/> : <ScreenShare/>}
                    </IconButton>

                    <IconButton aria-label="edit" onClick={onEditClicked}>
                        <EditIcon/>
                    </IconButton>

                    <IconButton aria-label="share" onClick={onDeleteClicked}>
                        <DeleteIcon/>
                    </IconButton>
                </CardActions>
            </Card>
        )
    })


    return (<>
        <Head>
            <title>Dear Diary</title>
        </Head>
        <Navbar/>
        <Box component='main'>
            <Box component='section' sx={{
                display: "flex",
                paddingTop: '1.3em',
                gap: '1.3em',
                flexDirection: 'column',
            }}>
                {cards}
            </Box>
            <Snackbar closeSnackbar={closeSnackbar} message={snackbarMessage} open={snackbarMessage !== ''}/>

            <Link href="/new" passHref>
                <BottomFab>
                    <AddIcon/>
                </BottomFab>
            </Link>
        </Box>
    </>)
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async ({AuthUser: user}) => {
    console.log('running getServerSideProps');

    const ref = getFirebaseAdmin().firestore()
        .collection("items")
        .where('author', '==', user?.id ?? "")
        .orderBy('createTime', 'desc')
        .limit(5)
    console.time('index.tsx: getServerSideProps: created ref')

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type FetchedDocs  = {[field: string]: any}[]

    const fetchedDocs = await Promise.race([
        async () => {
            console.time('index.tsx: getServerSideProps: get data from ref')
            const items = await ref.get()
            console.timeEnd('index.tsx: getServerSideProps: get data from firestore')
            return items.docs
        },
        new Promise((resolve) => {
            setTimeout(() => {
                console.warn('timed out')
                resolve([]);
            }, 8000);
        })
    ]) as FetchedDocs

    const docs = fetchedDocs.map((doc) => {
        const data = doc.data()

        let content = data.content.trim()
        if (content.length > CONTENT_LENGTH) {
            content = `${content.slice(0, CONTENT_LENGTH - 3)}...`
        }

        return {
            id: doc.id,
            content,
            createTime: data.createTime.toDate().toISOString(),
            isShared: data.isShared ?? false,
            title: data.title,
            updateTime: data.updateTime?.toDate()?.toISOString() ?? null,
            author: data.author,
        } as SSRItem
    })

    return {
        props: {
            items: docs
        }
    }
})

// @ts-ignore
export default withAuthUser({whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN})(Home)

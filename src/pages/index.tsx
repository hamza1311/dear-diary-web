import React, {useEffect, useRef, useState} from "react";
import {ItemWithId} from "../models/Item";
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
import {collection} from "../utils/firebase/firestore";
import {deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where} from 'firebase/firestore'
import Navbar from "../components/Navbar";
import {Box, Card as MuiCard, CardActions as MuiCardActions, CardContent as MuiCardContent} from "@mui/material";
import {styled} from "@mui/material/";


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
        padding: "0.8em 0"
    },
    [theme.breakpoints.up("lg")]: {
        marginLeft: "auto",
        flexDirection: "column",
        gap: '0.75em',
    },
}))


function Home({items: initialItems}: { items: SSRItem[] }) {
    const user = useAuthUser()
    const router = useRouter()

    const itemsCollection = collection("items")

    const [items, setItems] = useState<ItemWithId[]>(initialItems.map(itemFromSSRItem))
    const uid = user.id ?? ""
    useEffect(() => {
        const q = query(itemsCollection, where('author', '==', uid), orderBy('createTime', 'desc'))
        return onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(it => {
                const data = it.data()
                return {
                    id: it.id,
                    ...data
                } as ItemWithId
            })
            setItems(docs)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uid])
    const contentLength = 255

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const snackbarMessage = useRef("");


    const cards = items.map(item => {
        let content = item.content.trim()
        if (content.length > contentLength) {
            content = `${content.substr(0, contentLength - 3)}...`
        }
        content = removeMd(content)

        const onCardClick = async () => {
            await router.push(`/${item.id}`)
        }

        const onShareClicked = async () => {
            const isShared = !item.isShared
            await updateDoc(doc(itemsCollection, item.id), {isShared})
            if (isShared) {
                copy(window.location.href + item.id)
                snackbarMessage.current = "Link shared to clipboard"
            } else {
                snackbarMessage.current = "Stopped sharing"
            }
            setSnackbarOpen(true)
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
                        sm: {flexDirection: "column"},
                        lg: {alignItems: "center"},
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
            <Snackbar setOpen={setSnackbarOpen} message={snackbarMessage.current} open={snackbarOpen}/>

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

    const ref = getFirebaseAdmin().firestore()
        .collection("items")
        .where('author', '==', user?.id ?? "")
        .orderBy('createTime', 'desc')

    const items = await ref.get()
    const docs = items.docs.map((doc) => {
        const data = doc.data()
        return {
            id: doc.id,
            content: data.content,
            createTime: data.createTime.toDate().toISOString(),
            isShared: data.isShared,
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

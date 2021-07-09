import React, {useEffect, useRef, useState} from "react";
import {ItemWithId} from "../models/Item";
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import {Timestamp} from "../components/Timestamp";
import AddIcon from '@material-ui/icons/Add';
import BottomFab from "../components/BottomFab";
import EditIcon from "@material-ui/icons/Edit";
import removeMd from 'remove-markdown'
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import {ScreenShare, StopScreenShare} from "@material-ui/icons";
import copy from 'copy-to-clipboard';
import {useRouter} from "next/router";
import Snackbar from "../components/Snackbar";
import firebase from "firebase/app";
import 'firebase/firestore'
import Link from 'next/link'
import {AuthAction, getFirebaseAdmin, useAuthUser, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {itemFromSSRItem, SSRItem} from "../models/SsrItem";
import Navbar from "../components/Navbar";

const useStyles = makeStyles(theme => ({
    root: {},
    cardsContainer: {
        display: "flex",
        paddingTop: '1.3em',
        gap: '1.3em',
        flexDirection: 'column',
    },
    card: {
        minWidth: 275,
        margin: '0 auto',
        [theme.breakpoints.down("sm")]: {
            width: '90%',
        },
        [theme.breakpoints.up("sm")]: {
            width: '70%',
        },
    },
    cardContent: {
        cursor: 'pointer'
    },
    heading: {
        display: "flex",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column"
        },
        [theme.breakpoints.up("lg")]: {
            alignItems: "center",
        },
    },
    timeContainer: {
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
    },
    body: {
        paddingTop: '0.5em'
    },
    actions: {
        display: "flex",
        justifyContent: "end"
    },
}));


function Home({items: initialItems}: { items: SSRItem[] }) {
    const user = useAuthUser()
    const router = useRouter()

    const classes = useStyles();

    let firestore = firebase.firestore();
    let collection = firestore.collection("items")

    const [items, setItems] = useState<ItemWithId[]>(initialItems.map(itemFromSSRItem))
    const uid = user.id ?? ""
    useEffect(() => {
        return collection
            .where('author', '==', uid)
            .orderBy('createTime', 'desc')
            .onSnapshot((snapshot) => {
                const docs = snapshot.docs.map(it => {
                    const data = it.data()
                    return {
                        id: it.id,
                        ...data
                    } as ItemWithId
                })
                setItems(docs)
            })
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
            const newState = !item.isShared
            await collection.doc(item.id).update('isShared', newState)
            if (newState) {
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
            await collection.doc(item.id).delete()
        }

        return (
            <Card className={classes.card} key={item.id}>
                <CardContent onClick={onCardClick} className={classes.cardContent}>
                    <div className={classes.heading}>
                        <Typography variant="h5" component="h2">
                            {item.title}
                        </Typography>

                        <div className={classes.timeContainer}>
                            <Timestamp timestamp={item.createTime.toDate()} icon={AccessTimeIcon}/>
                            {item.updateTime &&
                            <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
                        </div>
                    </div>

                    <Typography variant="body1" component="p" className={classes.body}>
                        {content}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing className={classes.actions}>
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
        <main className={classes.root}>
            <section className={classes.cardsContainer}>
                {cards}
            </section>
            <Snackbar setOpen={setSnackbarOpen} message={snackbarMessage.current} open={snackbarOpen}/>

            <Link href="/new">
                <BottomFab>
                    <AddIcon/>
                </BottomFab>
            </Link>
        </main>
    </>)
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
})(async ({AuthUser: user, req}) => {

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

import React, {useRef, useState} from "react";
import {useFirestoreCollectionData, useUser} from "reactfire";
import {ItemWithId} from "../models/Item";
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import {Timestamp} from "./Timestamp";
import AddIcon from '@material-ui/icons/Add';
import {Link, useHistory} from 'react-router-dom'
import {useItemsCollection} from "../utils/hooks";
import BottomFab from "./BottomFab";
import EditIcon from "@material-ui/icons/Edit";
import removeMd from 'remove-markdown'
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import LoadingIndicator from "./LoadingIndicator";
import {ScreenShare, StopScreenShare} from "@material-ui/icons";
import copy from 'copy-to-clipboard';
import Snackbar from "./Snackbar";

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

export default function Home() {
    const user = useUser();

    return <ListItems uid={user.data.uid}/>

}

const ListItems = (props: { uid: string }) => {
    const history = useHistory()

    const classes = useStyles();

    let collection = useItemsCollection();
    const itemsRef = collection
        .where('author', '==', props.uid)
        .orderBy('createTime', 'desc')

    const resp = useFirestoreCollectionData<ItemWithId>(itemsRef, {
        idField: 'id'
    })

    const contentLength = 255
    let view

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const snackbarMessage = useRef("");

    switch (resp.status) {
        case "loading":
            view = <LoadingIndicator/>
            break
        case "error":
            view = <>Err</>
            break
        case "success":

            const cards = resp.data.map(item => {
                let content = item.content.trim()
                if (content.length > contentLength) {
                    content = `${content.substr(0, contentLength - 3)}...`
                }
                content = removeMd(content)

                const onCardClick = () => {
                    history.push(`/${item.id}`)
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

                const onEditClicked = () => {
                    history.push(`/edit/${item.id}`)
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

            view = (<>
                <section className={classes.cardsContainer}>
                    {cards}
                </section>
                <Snackbar setOpen={setSnackbarOpen} message={snackbarMessage.current} open={snackbarOpen} />
            </>)

            break
    }

    return (
        <main className={classes.root}>
            {view}
            <Link to="/new">
                <BottomFab>
                    <AddIcon/>
                </BottomFab>
            </Link>
        </main>
    )
}



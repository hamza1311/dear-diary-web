import React from "react";
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
import {Link, Redirect, useHistory} from 'react-router-dom'
import {useItemsCollection} from "../utils/hooks";
import BottomFab from "./BottomFab";
import EditIcon from "@material-ui/icons/Edit";
import removeMd from 'remove-markdown'
import AccessTimeIcon from "@material-ui/icons/AccessTime";

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
    /*[theme.breakpoints.down("sm")]: {
        heading: {
            flexDirection: "column"
        }
    },*/
}));

export default function Home() {
    const user = useUser();

    if (user.data) {
        return <ListItems uid={user.data.uid}/>
    } else {
        return <Redirect to="/login"/>
    }

}

const ListItems = (props: { uid: string }) => {
    const history = useHistory()

    const classes = useStyles();

    const itemsRef = useItemsCollection()
        .where('author', '==', props.uid)

    const {status, data: items} = useFirestoreCollectionData<ItemWithId>(itemsRef, {
        idField: 'id'
    })

    const contentLength = 255
    let view

    switch (status) {
        case "loading":
            view = <>loading</>
            break
        case "error":
            view = <>Err</>
            break
        case "success":
            const cards = items.map(item => {
                let content = item.content.trim()
                if (content.length > contentLength) {
                    content = `${content.substr(0, contentLength - 3)}...`
                }
                content = removeMd(content)

                const onCardClick = () => {
                    history.push(`/${item.id}`)
                }

                const onEditClicked = () => {
                    history.push(`/edit/${item.id}`)
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
                                    {item.updateTime && <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
                                </div>
                            </div>

                            <Typography variant="body1" component="p" className={classes.body}>
                                {content}
                            </Typography>
                        </CardContent>
                        <CardActions disableSpacing className={classes.actions}>
                            <IconButton aria-label="edit" onClick={onEditClicked}>
                                <EditIcon/>
                            </IconButton>

                            <IconButton aria-label="share">
                                <DeleteIcon/>
                            </IconButton>
                        </CardActions>
                    </Card>
                )
            })

            view = (
                <section className={classes.cardsContainer}>
                    {cards}
                </section>
            )

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



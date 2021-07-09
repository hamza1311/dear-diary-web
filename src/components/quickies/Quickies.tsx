import {BrowserRouter as Router, Route, Switch, useHistory, useParams} from "react-router-dom";

import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {useIsOnMobile} from "../../utils/hooks";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Toolbar from "@material-ui/core/Toolbar";
import SendIcon from "@material-ui/icons/Send";
import {
    CircularProgress,
    Dialog, DialogActions, DialogContent, DialogTitle,
    FormControl,
    Input,
    InputAdornment,
    InputLabel,
    ListItemIcon, TextField
} from "@material-ui/core";
import {Button, IconButton} from "@material-ui/core/";
import {
    useFirestore,
    useFirestoreCollectionData,
    useFirestoreDocData,
    useUser
} from "reactfire";
import LoadingIndicator from "../utils/LoadingIndicator";
import {QuickieCategory, QuickieCategoryWithId} from "../../models/QuickieCategory";
import {QuickieWithId} from "../../models/Quickie";
import firebase from "firebase/app";
import "firebase/firestore"
import {Timestamp} from "../utils/Timestamp";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import AddIcon from "@material-ui/icons/Add";

const drawerWidth = 240;
const PATH = '/quickies'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        overflow: 'auto',
    },
    content: {
        padding: theme.spacing(3),
        width: '100%',
        height: `calc(100vh - 64px)`, // TODO fetch height of header instead of hardcoding it
    },
}));

const useShowQuickieStyles = makeStyles(theme => ({
    root: {
        overflow: "visible",
    },
    actionsSection: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        paddingTop: theme.spacing(1),
    }
}))

const ShowQuickie = ({quickie}: { quickie: QuickieWithId }) => {
    const classes = useShowQuickieStyles()

    return (
        <Card className={classes.root}>
            <CardContent>
                <Typography variant="body1" component="p">
                    {quickie.content}
                </Typography>
                <section className={classes.actionsSection}>
                    <Timestamp timestamp={quickie.createTime.toDate()} icon={AccessTimeIcon}/>
                </section>
            </CardContent>
        </Card>
    )
}

const useCreateCategoryStyles = makeStyles(theme => ({
    textField: {
        margin: theme.spacing(3)
    },
    progress: {
        padding: theme.spacing(1)
    }
}))

const CreateCategory = ({show: open, setShow: setOpen}: { show: boolean, setShow: (value: boolean) => void }) => {
    const classes = useCreateCategoryStyles()

    const [name, setName] = useState("")
    const [saving, setSaving] = useState(false)

    const closeDialog = () => setOpen(false)

    const ref = useFirestore()
        .collection("quickieCategories")

    const user = useUser()

    const createCategory = async () => {
        setSaving(true)
        const doc: QuickieCategory = {
            author: user.data.uid,
            name,
            createTime: firebase.firestore.Timestamp.now()
        }

        await ref.add(doc)
        setSaving(false)
        closeDialog()
    }

    return (
        <Dialog open={open} onClose={closeDialog}>
            <DialogTitle>Create category</DialogTitle>

            <DialogContent>
                <TextField
                    placeholder="Category name"
                    disabled={saving}
                    className={classes.textField}
                    onChange={(e) => setName(e.currentTarget.value)}
                />
            </DialogContent>

            <DialogActions>
                {saving && <CircularProgress color="secondary" className={classes.progress}/>}
                <Button disabled={saving} onClick={closeDialog}>Cancel</Button>
                <Button disabled={saving} onClick={createCategory}>Create</Button>
            </DialogActions>
        </Dialog>
    )
}

const CategoriesList = ({categories}: { categories: QuickieCategoryWithId[] }) => {
    const history = useHistory()
    const [showingCreateDialog, setShowingCreateDialog] = useState(false)

    const navigateToCategory = (category: QuickieCategoryWithId) => {
        history.push(`${PATH}/${category.id}`)
    }

    const createCategory = () => {
        setShowingCreateDialog(true)
    }

    return (<>
        <List>
            {categories.map((category) => (
                <ListItem button key={category.id} onClick={() => navigateToCategory(category)}>
                    <ListItemText inset primary={category.name}/>
                </ListItem>
            ))}
            <ListItem button onClick={createCategory}>
                <ListItemIcon>
                    <AddIcon/>
                </ListItemIcon>
                <ListItemText primary="New"/>
            </ListItem>
        </List>
        <CreateCategory show={showingCreateDialog} setShow={setShowingCreateDialog}/>
    </>)
}

const HomeDrawer = (
    {selected, categories}: { selected: QuickieCategoryWithId, categories: QuickieCategoryWithId[] }
) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Drawer
                className={classes.drawer}
                variant="permanent"
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <Toolbar/>
                <div className={classes.drawerContainer}>
                    <CategoriesList categories={categories}/>
                </div>
            </Drawer>
            <main className={classes.content}>
                <ListQuickies category={selected}/>
            </main>
        </div>
    );
}


const useNewQuickieStyle = makeStyles(theme => ({
    form: {
        width: "100%",
    },
    createButton: {
        marginBottom: theme.spacing(2),
    }
}))

const NewQuickie = ({category: {id: categoryId}}: { category: QuickieCategoryWithId }) => {
    const classes = useNewQuickieStyle()

    const [content, setContent] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    const collectionRef = useFirestore()
        .collection(`quickieCategories/${categoryId}/quickies/`)

    const create = async () => {
        console.log('creating', content)
        setIsSaving(true)
        await collectionRef.add({
            content,
            createTime: firebase.firestore.Timestamp.now()
        })
        setContent("")
        setIsSaving(false)
    }

    const onKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            await create()
        }
    }

    return (
        <FormControl className={classes.form} disabled={isSaving}>
            <InputLabel htmlFor="new-quickie">Quickie</InputLabel>
            <Input
                id="new-quickie"
                value={content}
                disabled={isSaving}
                onChange={(e) => setContent(e.currentTarget.value)}
                onKeyUp={onKeyUp}
                endAdornment={
                    <InputAdornment position="end" className={classes.createButton}>
                        <IconButton
                            aria-label="create quickie"
                            disabled={isSaving}
                            onClick={create}
                            onMouseDown={(e) => e.preventDefault()}
                        >
                            {isSaving ? <CircularProgress color="secondary"/> : <SendIcon/>}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    )
}

const useListQuickiesStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        [theme.breakpoints.down("sm")]: {
            height: `calc(100vh - 96px)`, // TODO no hardcoding it
            padding: theme.spacing(2),
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
        }
    },
    quickiesListContainer: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        maxHeight: "90%",
        overflow: "auto",
        flexGrow: 1
    },
    newQuickieContainer: {
        marginTop: "auto",
        display: "flex",
        gap: theme.spacing(2),
    },
}))

const ListQuickies = ({category}: { category: QuickieCategoryWithId }) => {
    const classes = useListQuickiesStyles()

    const resp = useQuickies(category)
    if (!resp.data || resp.status === "loading") {
        return <LoadingIndicator />
    }

    const view = resp.data.map(quickie => <ShowQuickie quickie={quickie} key={quickie.id}/>)
    return (
        <section className={classes.root}>
            <section className={classes.quickiesListContainer}>
                {view}
            </section>
            <section className={classes.newQuickieContainer}>
                <NewQuickie category={category}/>
            </section>
        </section>
    )
}

const Home = ({isOnMobile}: { isOnMobile: boolean }) => {
    const {category} = useParams<{ category?: string }>()

    const resp = useCategories()
    switch (resp.status) {
        case "loading":
            return <LoadingIndicator/>
        case "error":
            console.error(resp)
            return <>{resp.error}</>
        case "success":
            console.log(resp)
            const categories = resp.data
            const selected = categories.find(it => it.id === category) ?? categories[0]

            return isOnMobile
                ? <CategoriesList categories={categories}/>
                : <HomeDrawer selected={selected} categories={categories}/>
    }
}

export default function Quickies() {
    const isOnMobile = useIsOnMobile()

    const ShowMobile = () => {
        const {category} = useParams<{ category: string }>()
        const resp = useCategory(category)
        switch (resp.status) {
            case "loading":
                return <LoadingIndicator/>
            case "error":
                console.error(resp)
                return <>{resp.error}</>
            case "success":
                return <ListQuickies category={resp.data}/>
        }
    }

    return (
        <Router>
            <Switch>
                <Route path={`${PATH}/:category`}>
                    {isOnMobile ? <ShowMobile/> : <Home isOnMobile={false}/>}
                </Route>

                <Route path={PATH} exact={true}>
                    <Home isOnMobile={isOnMobile}/>
                </Route>
            </Switch>
        </Router>
    )
}

const useCategories = () => {
    const user = useUser()
    const ref = useFirestore()
        .collection("quickieCategories")
        .where("author", "==", user.data.uid)

    return useFirestoreCollectionData<QuickieCategoryWithId>(ref, {
        idField: 'id'
    })
}

const useCategory = (id: string) => {
    const ref = useFirestore()
        .collection("quickieCategories")
        .doc(id)

    return useFirestoreDocData<QuickieCategoryWithId>(ref, {
        idField: 'id'
    })
}

const useQuickies = ({id}: QuickieCategoryWithId) => {

    const ref = useFirestore()
        .collection(`quickieCategories/${id}/quickies/`)
        .orderBy("createTime", "asc")

    return useFirestoreCollectionData<QuickieWithId>(ref, {
        idField: 'id'
    })
}

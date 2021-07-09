import 'firebase/firestore'
import {AuthAction, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {SSRItem, itemFromSSRItem} from "../models/SsrItem";
import getDocFromIdServerSide from '../utils/getDocFromIdServerSide';
import {useIsOnMobile} from "../utils/hooks";
import Typography from "@material-ui/core/Typography";
import {Timestamp} from "../components/Timestamp";
import {makeStyles} from "@material-ui/core/styles";
import BottomFab from "../components/BottomFab";
import EditIcon from '@material-ui/icons/Edit';
import ReactMarkdown from 'react-markdown'
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Person from "@material-ui/icons/Person";
import {useRouter} from "next/router";


const useStyles = makeStyles(theme => ({
    root: {
        padding: "1em 2em",
        display: "flex",
        gap: "1.25em",
        [theme.breakpoints.down("xs")]: {
            flexDirection: "column"
        },
    },
    left: {
        display: "flex",
        flexDirection: "column",
    },
    right: {
        display: "flex",
        flexDirection: "column",
        gap: '0.75em',
        [theme.breakpoints.up("sm")]: {
            paddingTop: '1em',
            marginLeft: "auto",
        },
    },
    heading: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        [theme.breakpoints.down("sm")]: {
            paddingBottom: theme.spacing(2)
        }
    },
    content: {
        paddingBottom: theme.spacing(2),
        overflowWrap: "anywhere",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
    },
    authorContainer: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1)
    },
    metadataContainer: {
        [theme.breakpoints.down("sm")]: {
            display: "flex",
            flexDirection: "column",
            gap: '0.5em'
        },
    }
}))

function Show(props: { item: SSRItem }) {
    const item = itemFromSSRItem(props.item)
    const classes = useStyles()
    const isOnMobile = useIsOnMobile();
    const router = useRouter()

    const onEditClicked = async () => {
        await router.push(`/edit/${item.id}`)
    }

    const view = isOnMobile ? (<>
        <section className={classes.left}>
            <Typography variant="h4" component="h2" className={classes.heading}>
                {item.title}
            </Typography>

            <div className={classes.metadataContainer}>
                <div className={classes.authorContainer}>
                    <Person/>
                    <Typography variant="subtitle1" component="span">{item.author.substr(0, 16)}</Typography>
                </div>
                <Timestamp timestamp={item.createTime.toDate()} icon={AccessTimeIcon}/>
                {item.updateTime && <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
            </div>
        </section>
        <section className={classes.right}>
            <Typography variant="body1" component="article" className={classes.content}>
                <ReactMarkdown>
                    {item.content}
                </ReactMarkdown>
            </Typography>
        </section>
    </>) : (<>
        <section className={classes.left}>
            <Typography variant="h4" component="h2" className={classes.heading}>
                {item.title}
            </Typography>

            <Typography variant="body1" component="article" className={classes.content}>
                <ReactMarkdown>
                    {item.content}
                </ReactMarkdown>
            </Typography>
        </section>
        <section className={classes.right}>
            <div className={classes.authorContainer}>
                <Person/>
                <Typography variant="subtitle2" component="span">{item.author.substr(0, 16)}</Typography>
            </div>
            <Timestamp timestamp={item.createTime.toDate()} icon={AccessTimeIcon}/>
            {item.updateTime && <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
        </section>
    </>)

    return <main className={classes.root}>
        {view}

        <BottomFab onClick={onEditClicked}>
            <EditIcon/>
        </BottomFab>
    </main>
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
})(async (context) => {
    return getDocFromIdServerSide(context)
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    // @ts-ignore
})(Show)

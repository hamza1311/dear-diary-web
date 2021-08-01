import {AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {SSRItem, itemFromSSRItem} from "../models/SsrItem";
import getDocFromIdServerSide from '../utils/getDocFromIdServerSide';
import {useIsOnMobile} from "../utils/hooks";
import Typography from "@material-ui/core/Typography";
import {Timestamp} from "../components/Timestamp";
import {makeStyles} from "@material-ui/core/styles";
import EditIcon from '@material-ui/icons/Edit';
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Person from "@material-ui/icons/Person";
import {useRouter} from "next/router";
import {useEffect, useRef} from "react";
import BottomFab from "../components/BottomFab";


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
        '& p': {
            margin: 0
        }
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
    const authUser = useAuthUser()
    const typographyRef = useRef<any>()

    useEffect(() => {
        if (typographyRef.current) {
            typographyRef.current.innerHTML = item.content
        }
    })
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
            <Typography
                variant="body1"
                component="article"
                className={classes.content}
                innerRef={typographyRef}>
            </Typography>
        </section>
    </>) : (<>
        <section className={classes.left}>
            <Typography variant="h4" component="h2" className={classes.heading}>
                {item.title}
            </Typography>

            <Typography
                variant="body1"
                component="article"
                className={classes.content}
                innerRef={typographyRef}>
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

    const bottomFab = (
        <BottomFab onClick={onEditClicked}>
            <EditIcon/>
        </BottomFab>
    )

    return <main className={classes.root}>
        {view}

        {item.author === authUser.id && bottomFab}
    </main>
}

export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.RENDER,
})(async (context) => {
    const showdown = await import("showdown")
    const data = await getDocFromIdServerSide(context)

    if (data?.props?.item?.content) {
        const converter = new showdown.default.Converter()
        data.props.item.content = converter.makeHtml(data.props.item.content)
    }
    return data
})

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.RENDER,
    // @ts-ignore
})(Show)

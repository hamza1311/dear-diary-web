import React, {useEffect, useRef} from "react";
import {AuthAction, useAuthUser, withAuthUser, withAuthUserTokenSSR} from "next-firebase-auth";
import {itemFromSSRItem, SSRItem} from "../models/SsrItem";
import getDocFromIdServerSide from '../utils/getDocFromIdServerSide';
import {useIsOnMobile} from "../utils/hooks";
import {Timestamp} from "../components/Timestamp";
import {AccessTime as AccessTimeIcon, Edit as EditIcon, Person as PersonIcon} from '@mui/icons-material';
import {useRouter} from "next/router";
import BottomFab from "../components/BottomFab";
import Navbar from "../components/Navbar";
import {Box, styled, Typography} from "@mui/material/";
import LoadingIndicator from "../components/LoadingIndicator";
import type { FunctionComponent } from 'react'
import Head from "next/head";
import {User} from "../models/User";

const RootContainer = styled(Box)(({theme}) => ({
    padding: theme.spacing(1, 2),
    display: "flex",
    gap: 1.25,
    [theme.breakpoints.down('sm')]: {
        flexDirection: 'column'
    }
}));


const MetadataContainer = styled(Box)(({theme}) => ({
    [theme.breakpoints.down('sm')]: {
        display: "flex",
        gap: theme.spacing(1),
        padding: theme.spacing(1, 0),
    },
}));

const LeftContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
});


const RightContainer = styled(Box)(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    gap: '0.75em',
    [theme.breakpoints.up("sm")]: {
        paddingTop: '1em',
        marginLeft: "auto",
    },
}));

const Author = ({author}: { author: string | User }) => {
    const isOnMobile = useIsOnMobile();
    const variant = isOnMobile ? "subtitle2" : "subtitle1";

    if (typeof author === 'object') {
        author = author.displayName
    }

    return (<Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1
    }}>
        <PersonIcon/>
        <Typography variant={variant} component="span">{author}</Typography>
    </Box>)
}

const ItemHeading = ({heading}: { heading: string }) => {
    return <Typography variant="h4" component="h2" sx={{
        padding: theme => theme.spacing(3, 0),
        sm: {
            paddingBottom: 2
        }
    }}>
        {heading}
    </Typography>
}
const ItemContent = ({content}: { content: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const typographyRef = useRef<any>()

    useEffect(() => {
        if (typographyRef.current) {
            typographyRef.current.innerHTML = content
        }
    })

    return (
        <Typography
            variant="body1"
            component="article"
            sx={{
                paddingBottom: 2,
                overflowWrap: "anywhere",
                display: "flex",
                flexDirection: "column",
                gap: 1,
                '& p': {
                    margin: 0
                }
            }}
            ref={typographyRef} />
    )
}

interface Props { item: SSRItem }

function Show(props: Props) {
    const item = itemFromSSRItem(props.item)
    const isOnMobile = useIsOnMobile();
    const router = useRouter()
    const authUser = useAuthUser()

    const onEditClicked = async () => {
        await router.push(`/edit/${item.id}`)
    }

    const view = isOnMobile ? (<>
        <LeftContainer component="section">
            <ItemHeading heading={item.title}/>

            <MetadataContainer>
                <Author author={item.author}/>
                <Timestamp timestamp={item.createTime.toDate()} icon={AccessTimeIcon}/>
                {item.updateTime && <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
            </MetadataContainer>
        </LeftContainer>
        <RightContainer component="section">
            <ItemContent content={item.content}/>

        </RightContainer>
    </>) : (<>
        <LeftContainer component="section" sx={{px: 1}}>
            <ItemHeading heading={item.title}/>
            <ItemContent content={item.content}/>

        </LeftContainer>
        <RightContainer component="section">
            <Author author={item.author}/>
            <Timestamp timestamp={item.createTime.toDate()} icon={AccessTimeIcon}/>
            {item.updateTime && <Timestamp timestamp={item.updateTime.toDate()} icon={EditIcon}/>}
        </RightContainer>
    </>)

    const bottomFab = (
        <BottomFab onClick={onEditClicked}>
            <EditIcon/>
        </BottomFab>
    )

    return (<>
        <Head>
            <title>{item.title} | Dear Diary</title>
        </Head>
        <Navbar/>
        <RootContainer>
            {view}

            {(typeof item.author === 'object' && item.author.uid === authUser.id) && bottomFab}
        </RootContainer>
    </>)
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

const Loader: FunctionComponent = () => <LoadingIndicator />

export default withAuthUser<Props>({
    whenAuthed: AuthAction.RENDER,
    whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
    whenUnauthedAfterInit: AuthAction.RENDER,
    LoaderComponent: Loader
})(Show)

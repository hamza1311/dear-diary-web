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

const MetadataContainer = styled(Box)(({theme}) => ({
    sm: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(0.5)
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

const Author = ({author}: { author: string }) => {
    const isOnMobile = useIsOnMobile();
    const variant = isOnMobile ? "subtitle2" : "subtitle1";

    return (<Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1
    }}>
        <PersonIcon/>
        <Typography variant={variant} component="span">{author.substr(0, 16)}</Typography>
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

function Show(props: { item: SSRItem }) {
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
        <LeftContainer component="section">
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
        <Navbar/>
        <Box sx={{
            padding: theme => theme.spacing(1, 2),
            display: "flex",
            gap: 1.25,
            sx: {flexDirection: "column"}
        }}>
            {view}

            {item.author === authUser.id && bottomFab}
        </Box>
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

export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.RENDER,
    // @ts-ignore
})(Show)

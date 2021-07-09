import React, {useRef, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import {Button, Menu, Link} from "@material-ui/core";
import firebase from 'firebase/app'
import 'firebase/auth'
import {useRouter} from "next/router";
import {useAuthUser} from "next-firebase-auth";

function RouterLink(props: React.PropsWithChildren<{ href: string, className: any }>) {
    const router = useRouter()
    const onClick = async (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        await router.push(props.href)
    }

    return <Link
        href={props.href}
        onClick={onClick}
        className={props.className}
    >
        {props.children}
    </Link>
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
    },
    toolbar: {
        display: "grid",
        gridTemplateAreas: '"title links user"',
        gridTemplateColumns: "1fr 3fr 1fr",
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    titleContainer: {
        flexGrow: 1,
        gridArea: "title"
    },
    link: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
    },
    title: {
        fontWeight: 500
    },
    linksContainer: {
        display: "flex",
        gridArea: "links",
    },
    userContainer: {
        gridArea: "user",
        justifySelf: "end",
    }
}));

function Navbar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
    const iconButtonRef = useRef<HTMLSpanElement | null>(null)
    const open = Boolean(anchorEl);

    const router = useRouter()

    const handleClose = () => {
        setAnchorEl(null);
    };

    let auth = firebase.auth()
    const signOut = async () => {
        await router.push("/auth")
        await auth.signOut()
    }

    const user = useAuthUser()

    const navigateToProfile = async () => {
        await router.push("/profile")
        handleClose()
    }

    // @ts-ignore
    const handleMenu = () => {
        setAnchorEl(iconButtonRef.current);
    };

    const authMenu = (
        <div className={classes.userContainer}>
            <span ref={iconButtonRef}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    color="inherit"
                >
                    <AccountCircle/>
                </IconButton>
            </span>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={navigateToProfile}>Profile</MenuItem>
                <MenuItem onClick={signOut}>Sign out</MenuItem>
            </Menu>
        </div>
    )

    const loginButton = <RouterLink href="/auth" className={classes.link}>
        <Button>Log in</Button>
    </RouterLink>

    return (<>
        <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <RouterLink href="/" className={`${classes.titleContainer} ${classes.link}`}>
                        <Typography variant="h5" component="h1" className={classes.title}>
                            Dear Diary
                        </Typography>
                    </RouterLink>
                    <section className={classes.linksContainer}>
                        <RouterLink href="/quickies" className={classes.link}>
                            <Button>
                                Quickies
                            </Button>
                        </RouterLink>
                    </section>
                    {user.firebaseUser ? loginButton : authMenu}
                </Toolbar>
            </AppBar>
        </div>
        <Toolbar/>
    </>);
}

Navbar.defaultProps = {
    asFallback: false
}

export default Navbar

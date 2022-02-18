import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import {Button, Link, Menu, MenuItem} from "@material-ui/core";
import { signOut } from 'firebase/auth'
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
        display: "flex",
        justifyItems: 'space-between',
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
    const open = Boolean(anchorEl);

    const router = useRouter()

    const handleClose = () => {
        setAnchorEl(null);
    };
    const {user} = useAuthUser()
    const signOut = async () => {
        await signOut()
        await router.push("/auth")
    }

    const navigateToProfile = async () => {
        await router.push("/profile")
        handleClose()
    }

    // @ts-ignore
    const handleMenu = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const authMenu = (
        <div className={classes.userContainer}>
            <span>
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
                    {user ? loginButton : authMenu}
                </Toolbar>
            </AppBar>
        </div>
        <Toolbar/>
    </>);
}

export default Navbar

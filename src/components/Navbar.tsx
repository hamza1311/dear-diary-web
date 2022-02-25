import React, {useState} from 'react';
import {AccountCircle} from '@mui/icons-material';
import {
    AppBar,
    Box,
    Button,
    IconButton,
    Link,
    LinkProps,
    Menu,
    MenuItem,
    Toolbar,
    Typography,
    useTheme
} from "@mui/material";
import {signOut} from '../utils/firebase/auth'
import {useRouter} from "next/router";
import {useAuthUser} from "next-firebase-auth";

function RouterLink(props: React.PropsWithChildren<LinkProps>) {
    const router = useRouter()
    const onClick = async (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()
        await router.push(props.href ?? '')
    }

    return <Link
        href={props.href}
        onClick={onClick}
        sx={props.sx}
    >
        {props.children}
    </Link>
}

function Navbar() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState<HTMLSpanElement | null>(null);
    const open = Boolean(anchorEl);

    const router = useRouter()

    const handleClose = () => {
        setAnchorEl(null);
    };

    const {firebaseUser: user} = useAuthUser()

    const handleSignOut = async () => {
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
        <Box>
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
                <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
            </Menu>
        </Box>
    )

    const loginButton = <RouterLink href="/auth">
        <Button>Log in</Button>
    </RouterLink>

    return (<>
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed" sx={{zIndex: theme.zIndex.drawer + 1}}>
                <Toolbar sx={{display: "flex", justifyContent: 'space-between',}}>
                    <RouterLink href="/" sx={{color: theme.palette.text.primary}}>
                        <Typography variant="h5" component="h1">
                            Dear Diary
                        </Typography>
                    </RouterLink>
                    {user ? authMenu : loginButton}
                </Toolbar>
            </AppBar>
        </Box>
        <Toolbar/>
    </>);
}

export default Navbar

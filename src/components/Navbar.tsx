import React, {lazy, Suspense} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import {Link, useHistory} from 'react-router-dom'
import {useAuth, useUser} from "reactfire";
import {Button} from "@material-ui/core";
import SuspenseFallback from "./SuspenseFallback";

const Menu = lazy(() => import('@material-ui/core/Menu'));

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    titleContainer: {
        flexGrow: 1,

    },
    link: {
        color: theme.palette.text.primary,
        textDecoration: 'none',
    },
    title: {
        fontWeight: 500
    }
}));

export default function Navbar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const history = useHistory()

    const handleClose = () => {
        setAnchorEl(null);
    };

    let auth = useAuth()
    const signOut = async () => {
        history.push("/login")
        await auth.signOut()
    }

    const user = useUser()

    const navigateToProfile = async () => {
        history.push("/profile")
        handleClose()
    }

    // @ts-ignore
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const authMenu = (
        <div>
            <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
            >
                <AccountCircle/>
            </IconButton>
            <Suspense fallback={<SuspenseFallback />}>
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
            </Suspense>
        </div>
    )

    const loginButton = <Link to="/login" className={classes.link}>
        <Button>Log in</Button>
    </Link>

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Link to="/" className={`${classes.titleContainer} ${classes.link}`}>
                        <Typography variant="h5" component="h1" className={classes.title}>
                            Dear Diary
                        </Typography>
                    </Link>
                    {user.data ? authMenu : loginButton}
                </Toolbar>
            </AppBar>
        </div>
    );
}

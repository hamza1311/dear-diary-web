import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import {Link} from 'react-router-dom'
import {useAuth} from "reactfire";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    titleContainer: {
        flexGrow: 1,
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


    const handleClose = () => {
        setAnchorEl(null);
    };

    let auth = useAuth()
    const signOut = async () => {
        await auth.signOut()
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
                <MenuItem onClick={signOut}>Sign out</MenuItem>
            </Menu>
        </div>
    )

    const loginButton = <></>

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <Link to="/" className={classes.titleContainer}>
                        <Typography variant="h5" component="h1" className={classes.title}>
                            Dear Diary
                        </Typography>
                    </Link>
                    {auth ? authMenu : loginButton}
                </Toolbar>
            </AppBar>
        </div>
    );
}

import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    TextField,
    Tooltip,
    Typography
} from "@material-ui/core";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core"
import {useUser} from "reactfire";
import {makeStyles} from "@material-ui/core/styles";
import {Person, Edit, MoreHoriz, Save, Warning} from "@material-ui/icons";
import React, {useState} from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {PasswordField} from "./Auth";
import firebase from "firebase/app";
import "firebase/auth"
import Snackbar from "./Snackbar";

const useInfoCardStyles = makeStyles(theme => ({
    card: {
        width: '50%',
        [theme.breakpoints.down("sm")]: {
            width: '90%',
            margin: "auto",
        }
    },
    cardContent: {
        display: "flex",
        alignItems: "center",
        gap: theme.spacing(1)
    },
}))

const ProfileInfoCard = ({children}: { children: any }) => {
    const classes = useInfoCardStyles()

    return <Card className={classes.card}>
        <CardContent className={classes.cardContent}>
            {children}
        </CardContent>
    </Card>
}

const useCardActionsStyles = makeStyles(({
    cardContentRight: {
        marginLeft: "auto",
    },
}))

interface EditOrSaveButtonProps {
    editing: boolean
    loading: boolean
    setEditing: (value: boolean) => void
    onSaveClick: () => void
}

const EditOrSaveButton = ({editing, loading, setEditing, onSaveClick}: EditOrSaveButtonProps) => {
    const classes = useCardActionsStyles()
    if (loading) {
        return <CircularProgress className={classes.cardContentRight} color="secondary"/>
    }

    return editing
        ? <IconButton
            className={classes.cardContentRight}
            onClick={onSaveClick}
        >
            <Save/>
        </IconButton>
        : <IconButton
            className={classes.cardContentRight}
            onClick={() => setEditing(true)}
        >
            <Edit/>
        </IconButton>
}

const UpdatePhotoButton = () => {
    const classes = useCardActionsStyles()
    const [anchorEl, setAnchorEl] = useState<EventTarget & HTMLButtonElement | null>(null)
    const open = Boolean(anchorEl)

    const handleClose = () => {
        setAnchorEl(null);
    };

    const removePhoto = () => {
        // TODO
        handleClose()
    }

    return (<>
        <IconButton className={classes.cardContentRight} onClick={(e) => setAnchorEl(e.currentTarget)}>
            <MoreHoriz/>
        </IconButton>

        <Menu
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
            anchorEl={anchorEl}
            onClose={handleClose}
        >
            <MenuItem onClick={removePhoto}>Remove Photo</MenuItem>
            <MenuItem>Update Photo</MenuItem>
        </Menu>
    </>)
}

const useChangePasswordStyles = makeStyles(theme => ({
    root: {
        [theme.breakpoints.down("sm")]: {
            marginLeft: "5%",
        }
    },
    passwordHeading: {
        marginBottom: theme.spacing(2),
    },
    changePasswordButton: {
        width: 'max-content',
    },
    dialogContent: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2)
    }
}))

const ChangePassword = () => {
    const classes = useChangePasswordStyles()

    const [dialogOpen, setDialogOpen] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const user = useUser()

    const showDialog = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };


    const changePassword = async () => {
        setChangingPassword(true)
        if (newPassword !== confirmNewPassword) {
            setError("passwords do not match")
        } else {
            if (user.data.email === null) {
                throw Error("unreachable")
            }

            const credential = firebase.auth.EmailAuthProvider.credential(user.data.email, oldPassword)
            await user.data.reauthenticateWithCredential(credential)

            await user.data.updatePassword(newPassword)
            setSnackbarOpen(true)
        }
        setChangingPassword(false)
        handleClose()
    }

    return (<>
        <section className={classes.root}>
            <Typography variant="h5" component="h3" className={classes.passwordHeading}>Password</Typography>
            <Button variant="contained" onClick={showDialog} className={classes.changePasswordButton}>
                Change Password
            </Button>

            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="change-password-dialog-title">
                <DialogTitle id="change-password-dialog-title">Change Password</DialogTitle>

                <DialogContent className={classes.dialogContent}>
                    <PasswordField
                        disabled={changingPassword}
                        value={oldPassword}
                        label="Old password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <PasswordField
                        disabled={changingPassword}
                        value={newPassword}
                        label="New password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <PasswordField
                        disabled={changingPassword}
                        value={confirmNewPassword}
                        label="Confirm new password"
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />

                    <Button
                        className={classes.changePasswordButton}
                        disabled={changingPassword}
                    >Reset password</Button>

                    {error && error}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={changingPassword}>Cancel</Button>
                    <Button onClick={changePassword} disabled={changingPassword}>Update</Button>
                </DialogActions>
            </Dialog>
        </section>
        <Snackbar message="Password changed successfully" open={snackbarOpen} setOpen={setSnackbarOpen} />
    </>)
}


const useStyles = makeStyles(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
        paddingTop: theme.spacing(2),

        [theme.breakpoints.up("sm")]: {
            paddingLeft: theme.spacing(2),
        },
    },
    cardContentInner: {
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(1),
    },
    pfp: {
        width: '3em',
        height: '3em',
    },
    emailInfoContainer: {
        display: "flex",
        gap: theme.spacing(2),
    },
    verifyEmailButton: {
        padding: 0
    }
}))

export default function Profile() {
    const classes = useStyles()

    const [editingDisplayName, setEditingDisplayName] = useState(false)
    const [newDisplayName, setNewDisplayName] = useState("")
    const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false)

    const [editingEmail, setEditingEmail] = useState(false)
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
    const [newEmail, setNewEmail] = useState("")

    const user = useUser()

    const updateDisplayName = async () => {
        setIsUpdatingDisplayName(true)
        await user.data.updateProfile({
            displayName: newDisplayName
        })
        setEditingDisplayName(false)
        setIsUpdatingDisplayName(false)
    }

    const updateEmail = async () => {
        setIsUpdatingEmail(true)
        // maybe use verifyBeforeUpdateEmail() ?
        await user.data.updateEmail(newEmail)
        setEditingEmail(false)
        setIsUpdatingEmail(false)
    }

    const verifyEmail = async () => {
        await user.data.sendEmailVerification()
    }

    const data = user.data
    const pfp = data.photoURL ? <></> : <Person className={classes.pfp}/>
    return (<main className={classes.root}>
        <ProfileInfoCard>
            {pfp}
            <Typography variant="h5" component="p">{data.displayName}</Typography>

            <UpdatePhotoButton/>
        </ProfileInfoCard>

        <ProfileInfoCard>
            <article className={classes.cardContentInner}>
                {
                    editingDisplayName
                        ? <TextField
                            placeholder="Display Name"
                            onChange={(e) => setNewDisplayName(e.currentTarget.value)}
                        />
                        : <>
                            <Typography variant="h6" component="h3">Display Name</Typography>
                            <Typography variant="body1" component="p">{data.displayName}</Typography>
                        </>
                }
            </article>

            <EditOrSaveButton editing={editingDisplayName} loading={isUpdatingDisplayName}
                              setEditing={setEditingDisplayName} onSaveClick={updateDisplayName}/>
        </ProfileInfoCard>


        <ProfileInfoCard>
            <article className={classes.cardContentInner}>
                {
                    editingEmail
                        ? <TextField
                            placeholder="Email"
                            type="email"
                            onChange={(e) => setNewEmail(e.currentTarget.value)}
                        /> : <>
                            <Typography variant="h6" component="h3">Email</Typography>
                            <div className={classes.emailInfoContainer}>
                                <Typography variant="body1" component="p">{data.email}</Typography>
                                {!data.emailVerified && <Tooltip title="Verify email">
                                    <IconButton className={classes.verifyEmailButton} onClick={verifyEmail}>
                                        <Warning/>
                                    </IconButton>
                                </Tooltip>}
                            </div>
                        </>
                }
            </article>

            <EditOrSaveButton editing={editingEmail} loading={isUpdatingEmail} setEditing={setEditingEmail}
                              onSaveClick={updateEmail}/>
        </ProfileInfoCard>

        <ChangePassword/>
    </main>)
}

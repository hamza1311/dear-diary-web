import {Button, Card, CardContent, IconButton, TextField, Tooltip, Typography} from "@material-ui/core";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core"
import {useUser} from "reactfire";
import {makeStyles} from "@material-ui/core/styles";
import {Person, Edit, MoreHoriz, Save, Warning} from "@material-ui/icons";
import React, {useState} from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import {PasswordField} from "./Auth";

const useInfoCardStyles = makeStyles(theme => ({
    card: {
        width: '50%',
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
    setEditing: (value: boolean) => void
    onSaveClick: () => void
}

const EditOrSaveButton = ({editing, setEditing, onSaveClick}: EditOrSaveButtonProps) => {
    const classes = useCardActionsStyles()

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

    const showDialog = () => {
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
    };


    const changePassword = () => {
        // TODO
        handleClose()
    }

    return (
        <section>
            <Typography variant="h5" component="h3" className={classes.passwordHeading}>Password</Typography>
            <Button variant="contained" onClick={showDialog} className={classes.changePasswordButton}>
                Change Password
            </Button>

            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="change-password-dialog-title">
                <DialogTitle id="change-password-dialog-title">Change Password</DialogTitle>

                <DialogContent className={classes.dialogContent}>
                    <PasswordField
                        disabled={false}
                        value={oldPassword}
                        label="Old password"
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <PasswordField
                        disabled={false}
                        value={newPassword}
                        label="New password"
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <PasswordField
                        disabled={false}
                        value={confirmNewPassword}
                        label="Confirm new password"
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                    />

                    <Button className={classes.changePasswordButton}>Reset password</Button>
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={changePassword}>Update</Button>
                </DialogActions>
            </Dialog>
        </section>
    )
}


const useStyles = makeStyles(theme => ({
    root: {
        paddingTop: theme.spacing(2),
        paddingLeft: theme.spacing(2),

        display: "flex",
        flexDirection: "column",
        gap: theme.spacing(2),
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

    const [editingName, setEditingName] = useState(false)
    const [editingEmail, setEditingEmail] = useState(false)

    const user = useUser()

    const updateDisplayName = () => {
        // TODO
        setEditingName(false)
    }

    const updateEmail = () => {
        // TODO
        setEditingEmail(false)
    }

    const verifyEmail = () => {
        // TODO
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
                    editingName
                        ? <TextField placeholder="Display Name"/>
                        : <>
                            <Typography variant="h6" component="h3">Display Name</Typography>
                            <Typography variant="body1" component="p">{data.displayName}</Typography>
                        </>
                }
            </article>

            <EditOrSaveButton editing={editingName} setEditing={setEditingName} onSaveClick={updateDisplayName}/>
        </ProfileInfoCard>


        <ProfileInfoCard>
            <article className={classes.cardContentInner}>
                {
                    editingEmail
                        ? <TextField placeholder="Email"/>
                        : <>
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

            <EditOrSaveButton editing={editingEmail} setEditing={setEditingEmail} onSaveClick={updateEmail}/>
        </ProfileInfoCard>

        <ChangePassword/>
    </main>)
}

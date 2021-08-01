import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import firebase from "firebase/app";
import {Button, Dialog, DialogContent, DialogActions, DialogTitle} from "@material-ui/core";
import PasswordField from "./PasswordField";
import "firebase/auth"
import {useAuthUser} from "next-firebase-auth";
import Snackbar from "./Snackbar";


const useStyles = makeStyles(theme => ({
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

export default function ChangePassword({
                                           dialogOpen,
                                           setDialogOpen
                                       }: { dialogOpen: boolean, setDialogOpen: (value: boolean) => void }) {
    const classes = useStyles()

    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState<string | null>(null)
    const [snackbarOpen, setSnackbarOpen] = useState(false)

    const authUser = useAuthUser()
    const user = authUser.firebaseUser

    if (user === null) {
        return <>unreachable</>
    }


    const handleClose = () => {
        setDialogOpen(false);
    };


    const changePassword = async () => {
        setChangingPassword(true)
        if (newPassword !== confirmNewPassword) {
            setError("passwords do not match")
        } else {
            if (user.email === null) {
                throw Error("unreachable")
            }

            const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword)
            await user.reauthenticateWithCredential(credential)

            await user.updatePassword(newPassword)
            setSnackbarOpen(true)
        }
        setChangingPassword(false)
        handleClose()
    }

    return (<>
        <section className={classes.root}>

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
        <Snackbar message="Password changed successfully" open={snackbarOpen} setOpen={setSnackbarOpen}/>
    </>)
}

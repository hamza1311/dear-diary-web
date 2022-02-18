import React, {useState} from "react";
import {Button, Dialog, DialogContent, DialogActions, DialogTitle, Box} from "@mui/material";
import PasswordField from "./PasswordField";
import {EmailAuthProvider, reauthenticateWithCredential, updatePassword} from "firebase/auth"
import {useAuthUser} from "next-firebase-auth";
import Snackbar from "./Snackbar";

type Props = { dialogOpen: boolean, setDialogOpen: (value: boolean) => void }
export default function ChangePassword({dialogOpen, setDialogOpen}: Props) {

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

            const credential = EmailAuthProvider.credential(user.email, oldPassword)
            await reauthenticateWithCredential(user, credential)

            await updatePassword(user, newPassword)
            setSnackbarOpen(true)
        }
        setChangingPassword(false)
        handleClose()
    }

    return (<>
        <Box component="section" sx={{sm: {marginLeft: "5%"}}}>

            <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="change-password-dialog-title">
                <DialogTitle id="change-password-dialog-title">Change Password</DialogTitle>

                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2
                }}>
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
                        sx={{width: 'max-content'}}
                        disabled={changingPassword}
                    >Reset password</Button>

                    {error && error}
                </DialogContent>

                <DialogActions>
                    <Button onClick={handleClose} disabled={changingPassword}>Cancel</Button>
                    <Button onClick={changePassword} disabled={changingPassword}>Update</Button>
                </DialogActions>
            </Dialog>
        </Box>
        <Snackbar message="Password changed successfully" open={snackbarOpen} setOpen={setSnackbarOpen}/>
    </>)
}

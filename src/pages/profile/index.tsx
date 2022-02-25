import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    styled,
    TextField,
    Tooltip,
    Typography
} from "@mui/material/";
import {Edit, Person, Save, Warning} from "@mui/icons-material";
import React, {PropsWithChildren, useState} from "react";
import ChangePassword from '../../components/ChangePassword'
import UpdatePhotoButton from '../../components/UpdatePhotoButton'
import {AuthAction, useAuthUser, withAuthUser} from "next-firebase-auth";
import {sendEmailVerification, updateEmail, updateProfile} from "firebase/auth";
import Navbar from "../../components/Navbar";
import Head from "next/head";

const ProfileInfoCard = ({children}: PropsWithChildren<unknown>) => {
    return <Card sx={{
        width: '50%',
        sm: {
            width: '90%',
            margin: "auto",
        }
    }}>
        <CardContent sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: 'space-between'
        }}>
            {children}
        </CardContent>
    </Card>
}

const ProfileInfoCardInner = styled(Box)(({theme}) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
}))

interface EditOrSaveButtonProps {
    editing: boolean
    loading: boolean
    setEditing: (value: boolean) => void
    onSaveClick: () => void
}

const EditOrSaveButton = ({editing, loading, setEditing, onSaveClick}: EditOrSaveButtonProps) => {
    if (loading) {
        return <CircularProgress color="secondary"/>
    }

    return editing
        ? <IconButton onClick={onSaveClick}>
            <Save/>
        </IconButton>
        : <IconButton onClick={() => setEditing(true)}>
            <Edit/>
        </IconButton>
}

const ProfilePicture = ({url}: { url?: string }) => {
    return url ? <></> : <Person sx={{
        width: '3em',
        height: '3em',
    }}/>
}

function Profile() {

    const [editingDisplayName, setEditingDisplayName] = useState(false)
    const [newDisplayName, setNewDisplayName] = useState("")
    const [isUpdatingDisplayName, setIsUpdatingDisplayName] = useState(false)

    const [editingEmail, setEditingEmail] = useState(false)
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false)
    const [newEmail, setNewEmail] = useState("")

    const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

    const authUser = useAuthUser()
    const user = authUser.firebaseUser
    if (user === null) {
        return <>unreachable</>
    }

    const updateDisplayName = async () => {
        setIsUpdatingDisplayName(true)
        await updateProfile(user, {
            displayName: newDisplayName
        })
        setEditingDisplayName(false)
        setIsUpdatingDisplayName(false)
    }

    const onUpdateEmailClick = async () => {
        setIsUpdatingEmail(true)
        // maybe use verifyBeforeUpdateEmail() ?
        await updateEmail(user, newEmail)
        setEditingEmail(false)
        setIsUpdatingEmail(false)
    }

    const verifyEmail = async () => {
        await sendEmailVerification(user)
    }

    const pfp = <ProfilePicture url={user.photoURL ?? undefined}/>
    return (
        <>
            <Head>
                <title>{user.displayName} | Dear Diary</title>
            </Head>
            <Navbar/>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                paddingTop: 2,

                sm: {
                    paddingLeft: 2,
                },
            }}>
                <ProfileInfoCard>
                    {pfp}
                    <Typography variant="h5" component="p">{user.displayName}</Typography>

                    <UpdatePhotoButton/>
                </ProfileInfoCard>

                <ProfileInfoCard>
                    <ProfileInfoCardInner component='section'>
                        {
                            editingDisplayName
                                ? <TextField
                                    placeholder="Display Name"
                                    onChange={(e) => setNewDisplayName(e.currentTarget.value)}
                                />
                                : <>
                                    <Typography variant="h6" component="h3">Display Name</Typography>
                                    <Typography variant="body1" component="p">{user.displayName}</Typography>
                                </>
                        }
                    </ProfileInfoCardInner>

                    <EditOrSaveButton editing={editingDisplayName} loading={isUpdatingDisplayName}
                        setEditing={setEditingDisplayName} onSaveClick={updateDisplayName}/>
                </ProfileInfoCard>


                <ProfileInfoCard>
                    <ProfileInfoCardInner component='section'>
                        {
                            editingEmail
                                ? <TextField
                                    placeholder="Email"
                                    type="email"
                                    onChange={(e) => setNewEmail(e.currentTarget.value)}
                                /> : <>
                                    <Typography variant="h6" component="h3">Email</Typography>
                                    <Box sx={{display: "flex", gap: 2}}>
                                        <Typography variant="body1" component="p">{user.email}</Typography>
                                        {!user.emailVerified && <Tooltip title="Verify email">
                                            <IconButton sx={{p: 0}} onClick={verifyEmail}>
                                                <Warning/>
                                            </IconButton>
                                        </Tooltip>}
                                    </Box>
                                </>
                        }
                    </ProfileInfoCardInner>

                    <EditOrSaveButton
                        editing={editingEmail}
                        loading={isUpdatingEmail}
                        setEditing={setEditingEmail}
                        onSaveClick={onUpdateEmailClick}
                    />
                </ProfileInfoCard>

                <section>
                    <Typography variant="h5" component="h3" sx={{p: 2}}>Password</Typography>
                    <Button variant="contained" onClick={() => setPasswordDialogOpen(true)}
                        sx={{width: 'max-content'}}>
                        Change Password
                    </Button>
                </section>

                <ChangePassword dialogOpen={passwordDialogOpen} setDialogOpen={setPasswordDialogOpen}/>
            </Box>
        </>)
}


export default withAuthUser({whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN})(Profile)

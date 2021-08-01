import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    TextField,
    Tooltip,
    Typography,
} from "@material-ui/core/";
import {makeStyles} from "@material-ui/core/styles";
import {Person, Edit, Save, Warning} from "@material-ui/icons";
import React, {useState} from "react";
import ChangePassword from '../../components/ChangePassword'
import UpdatePhotoButton from '../../components/UpdatePhotoButton'
import {AuthAction, useAuthUser, withAuthUser} from "next-firebase-auth";

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
    },
    passwordHeading: {
        marginBottom: theme.spacing(2),
    },
    changePasswordButton: {
        width: 'max-content',
    },
}))

function Profile() {
    const classes = useStyles()

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
        await user.updateProfile({
            displayName: newDisplayName
        })
        setEditingDisplayName(false)
        setIsUpdatingDisplayName(false)
    }

    const updateEmail = async () => {
        setIsUpdatingEmail(true)
        // maybe use verifyBeforeUpdateEmail() ?
        await user.updateEmail(newEmail)
        setEditingEmail(false)
        setIsUpdatingEmail(false)
    }

    const verifyEmail = async () => {
        await user.sendEmailVerification()
    }

    const pfp = user.photoURL ? <></> : <Person className={classes.pfp}/>
    return (<main className={classes.root}>
        <ProfileInfoCard>
            {pfp}
            <Typography variant="h5" component="p">{user.displayName}</Typography>

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
                            <Typography variant="body1" component="p">{user.displayName}</Typography>
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
                                <Typography variant="body1" component="p">{user.email}</Typography>
                                {!user.emailVerified && <Tooltip title="Verify email">
                                    <IconButton className={classes.verifyEmailButton} onClick={verifyEmail}>
                                        <Warning/>
                                    </IconButton>
                                </Tooltip>}
                            </div>
                        </>
                }
            </article>

            <EditOrSaveButton
                editing={editingEmail}
                loading={isUpdatingEmail}
                setEditing={setEditingEmail}
                onSaveClick={updateEmail}
            />
        </ProfileInfoCard>

        <section>
            <Typography variant="h5" component="h3" className={classes.passwordHeading}>Password</Typography>
            <Button variant="contained" onClick={() => setPasswordDialogOpen(true)}
                    className={classes.changePasswordButton}>
                Change Password
            </Button>
        </section>

        <ChangePassword dialogOpen={passwordDialogOpen} setDialogOpen={setPasswordDialogOpen}/>
    </main>)
}


export default withAuthUser({whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN})(Profile)

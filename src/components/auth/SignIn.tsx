import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, Card, CardContent} from "@material-ui/core";
import {useAuth} from "reactfire";
import {useHistory} from 'react-router-dom'
import LoadingIndicator from "../utils/LoadingIndicator";
import PasswordField from "../utils/PasswordField";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        display: 'flex'
    },
    wrapper: {
        margin: "auto",
        width: '35vw'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing(4),
        padding: theme.spacing(3),
    },
    signinButton: {
        width: 'max-content',
        alignSelf: 'center'
    }
}));

export default function SignIn() {
    const history = useHistory()

    const auth = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signingIn, setSigningIn] = useState(false)

    const classes = useStyles();

    const signIn = async () => {
        setSigningIn(true)
        await auth.signInWithEmailAndPassword(email, password)
        setSigningIn(false)
        history.push("/")
    }

    const form = (
        <form className={classes.form} noValidate autoComplete="off">
            <TextField
                label="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                disabled={signingIn}
            />

            <PasswordField
                disabled={signingIn}
                value={password}
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <Button
                onClick={signIn}
                variant="contained"
                className={classes.signinButton}
                disabled={signingIn}>Sign in</Button>
        </form>
    )

    return (
        <main className={classes.root}>
            <div className={classes.wrapper}>
                <Card>
                    <LoadingIndicator isVisible={signingIn}/>
                    <CardContent>
                        {form}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

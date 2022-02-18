import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import {Box, Button, Card, CardContent} from "@mui/material";
import LoadingIndicator from "../components/LoadingIndicator";
import PasswordField from "../components/PasswordField";
import {useRouter} from "next/router";
import {AuthAction, withAuthUser} from "next-firebase-auth";
import {signInWithEmailAndPassword} from "../utils/firebase/auth";

function SignIn() {
    const router = useRouter()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [signingIn, setSigningIn] = useState(false)


    const signIn = async () => {
        setSigningIn(true)
        await signInWithEmailAndPassword(email, password)
        setSigningIn(false)
        await router.push("/")
    }

    const form = (
        <Box component='form' sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: 3,
        }}>
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
                sx={{width: 'max-content', alignSelf: 'center'}}
                disabled={signingIn}>Sign in</Button>
        </Box>
    )
    return (
        <Box component='main' sx={{
            height: '100vh',
            display: 'flex'
        }}>
            <Box sx={{
                margin: "auto",
                width: '35vw'
            }}>
                <Card>
                    <LoadingIndicator isVisible={signingIn}/>
                    <CardContent>
                        {form}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

function Auth() {
    return <SignIn/>
}

export default withAuthUser({whenAuthed: AuthAction.REDIRECT_TO_APP})(Auth)

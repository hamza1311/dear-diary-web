import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {Button, Card, CardContent, FormControl, IconButton, Input, InputAdornment, InputLabel} from "@material-ui/core";
import {useAuth, useUser} from "reactfire";
import {Redirect, useHistory} from 'react-router-dom'
import {Visibility, VisibilityOff} from "@material-ui/icons";

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

export const SignIn = () => {
    const history = useHistory()

    const auth = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const user = useUser()

    const classes = useStyles();

    if (user.data) {
        return <Redirect to="/" />
    }

    const signIn = async () => {
        await auth.signInWithEmailAndPassword(email, password)
        history.push("/")
    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword)
    };

    const form = (
        <form className={classes.form} noValidate autoComplete="off">
            <TextField
                label="Email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <FormControl>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {showPassword ? <Visibility/> : <VisibilityOff/>}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>

            <Button onClick={signIn} variant="contained" className={classes.signinButton}>Sign in</Button>
        </form>
    )

    return (
        <main className={classes.root}>
            <div className={classes.wrapper}>
                <Card>
                    <CardContent>
                        {form}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

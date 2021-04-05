import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Navbar from "./Navbar";
import {useAuth} from 'reactfire';
import {SignIn} from "./Auth";
import 'firebase/auth'
import Home from "./Home";
import Create from "./Create";
import Show from "./Show";
import Edit from "./Edit";
import Profile from "./Profile";
import LoadingIndicator from "./LoadingIndicator";

export default function Routes() {
    const [isSignedIn, setIsSignedIn] = useState(false)
    const [loading, setLoading] = useState(true)
    const auth = useAuth()

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setIsSignedIn(Boolean(user))
            setLoading(false)
        })
        return unsub
    }, [auth])

    const AuthWrapper = ({children}: React.PropsWithChildren<{}>): JSX.Element => {
        if (loading) {
            return <>
                <Navbar/>
                <LoadingIndicator />
            </>
        }
        if (!isSignedIn) {
            console.log('redirect')
            return <Redirect to="/login"/>
        }
        console.log('fuck')
        return <>
            <Navbar/>
            {children}
        </>
    }

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <SignIn/>
                </Route>

                <Route path="/profile">
                    <AuthWrapper>
                        <Profile/>
                    </AuthWrapper>
                </Route>

                <Route path="/new">
                    <AuthWrapper>
                        <Create/>
                    </AuthWrapper>
                </Route>

                <Route path="/edit/:id">
                    <AuthWrapper>
                        <Edit/>
                    </AuthWrapper>
                </Route>

                <Route path="/:id">
                    <Navbar/>
                    <Show/>
                </Route>

                <Route
                    path="/"
                    exact={true}
                >
                    <AuthWrapper>
                        <Home/>
                    </AuthWrapper>
                </Route>
            </Switch>
        </Router>
    );
}


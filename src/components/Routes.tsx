import React, {Suspense, lazy, useEffect, useState} from "react"
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"

import {useAuth} from 'reactfire'
import 'firebase/auth'

import Navbar from './Navbar'
import Home from './Home'
import LoadingIndicator from "./utils/LoadingIndicator";

const Create = lazy(() => import("./Create"))
const Show = lazy(() => import("./Show"))
const Edit = lazy(() => import("./Edit"))
const Profile = lazy(() => import("./profile/Profile"))
const Auth = lazy(() => import("./auth/Auth"))

const renderFallback = () => (
    <>
        <Navbar asFallback={true} />
        <LoadingIndicator />
    </>
)

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
            return renderFallback()
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
            <Suspense fallback={renderFallback()}>
                <Switch>
                    <Route path="/login">
                        <Auth />
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

                    <Route path="/" exact={true}>
                        <AuthWrapper>
                            <Home/>
                        </AuthWrapper>
                    </Route>
                </Switch>
            </Suspense>
        </Router>
    );
}


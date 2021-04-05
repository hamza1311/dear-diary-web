import React, {Suspense, lazy} from "react"
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"

import {AuthCheck} from 'reactfire'
import 'firebase/auth'

import Navbar from './Navbar'
import LoadingIndicator from "./LoadingIndicator";

const Home = lazy(() => import("./Home"))
const Create = lazy(() => import("./Create"))
const Show = lazy(() => import("./Show"))
const Edit = lazy(() => import("./Edit"))
const Profile = lazy(() => import("./Profile"))
const Auth = lazy(() => import("./Auth"))

const renderFallback = () => (
    <>
        <Navbar/>
        <LoadingIndicator />
    </>
)

const AuthWrapper = ({children}: React.PropsWithChildren<{}>): JSX.Element => {
    return (
        <Suspense fallback={renderFallback()}>
            <AuthCheck fallback={<Redirect to="/login"/>}>
                <Navbar/>
                {children}
            </AuthCheck>
        </Suspense>
    )
}

export default function Routes() {
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


import React, {Suspense, lazy} from "react"
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom"

import {AuthCheck} from 'reactfire'
import {SignIn} from "./Auth"
import 'firebase/auth'

const Navbar = lazy(() => import("./Navbar"))
const Home = lazy(() => import("./Home"))
const Create = lazy(() => import("./Create"))
const Show = lazy(() => import("./Show"))
const Edit = lazy(() => import("./Edit"))
const Profile = lazy(() => import("./Profile"))
const LoadingIndicator = lazy(() => import("./LoadingIndicator"))

const AuthWrapper = ({children}: React.PropsWithChildren<{}>): JSX.Element => {
    return (
        <Suspense fallback={<LoadingIndicator />}>
            <AuthCheck fallback={<Redirect to="/login"/>}>
                <Navbar />
                {children}
            </AuthCheck>
        </Suspense>
    )
}

export default function Routes() {
    return (
        <Router>
            <Suspense fallback={<p>Loading...</p>}>
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


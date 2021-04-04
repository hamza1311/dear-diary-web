import React from "react";
import {BrowserRouter as Router, Switch, Route, RouteComponentProps, Redirect} from "react-router-dom";
import Navbar from "./Navbar";
import { useUser} from 'reactfire';
import {SignIn} from "./Auth";
import 'firebase/auth'
import Home from "./Home";
import Create from "./Create";
import Show from "./Show";
import Edit from "./Edit";
import Profile from "./Profile";

export default function Routes() {
    const currentUser = useUser();

    const renderAuthenticated = (props: RouteComponentProps, Comp: React.FunctionComponent) => {
        if (currentUser.status === "success") {
            return <>
                <Navbar/>
                <Comp />
            </>
        } else {
            return <Redirect to="/login"/>
        }
    }

    return (
        <Router>
            <Switch>
                <Route path="/login">
                    <SignIn/>
                </Route>

                <Route
                    path="/profile"
                    render={(routeProps) => renderAuthenticated(routeProps, Profile)}
                />


                <Route
                    path="/new"
                    render={(routeProps) => renderAuthenticated(routeProps, Create)}
                />

                <Route
                    path="/edit/:id"
                    render={(routeProps) => renderAuthenticated(routeProps, Edit)}
                />

                <Route path="/:id">
                    <Navbar />
                    <Show />
                </Route>

                <Route
                    path="/"
                    exact={true}
                    render={(routeProps) => renderAuthenticated(routeProps, Home)}
                />
            </Switch>
        </Router>
    );
}


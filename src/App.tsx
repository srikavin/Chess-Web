import React from 'react';
import {UserProfileRoute} from "./features/user_profile/UserProfile";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import {Navigation} from "./features/navigation/Navigation";
import {PlayGameRoute} from "./features/play_game/PlayGame";
import {RecentGames} from "./features/game/RecentGames";
import {LoginRoute, RegisterRoute} from "./features/auth/Authentication";
import {ConnectedRouter} from "connected-react-router";
import {history} from "./app/store";
import {Landing} from "./features/landing/Landing";

function App() {
    return (
        <>
            <Router>
                <ConnectedRouter history={history}>
                    <Navigation/>
                    <div className="container mx-auto">
                        <Switch>
                            <Route path="/users/:id">
                                <UserProfileRoute/>
                            </Route>
                            <Route path="/games/:id">
                                <PlayGameRoute/>
                            </Route>
                            <Route path="/games">
                                <RecentGames/>
                            </Route>
                            <Route path="/register">
                                <RegisterRoute/>
                            </Route>
                            <Route path="/login">
                                <LoginRoute/>
                            </Route>
                            <Route path="/">
                                <Landing/>
                            </Route>
                        </Switch>
                    </div>
                </ConnectedRouter>
            </Router>
        </>

    );
}

export default App;

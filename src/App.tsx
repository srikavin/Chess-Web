import React from 'react';
import './App.css';
import {UserProfileRoute} from "./features/user_profile/UserProfile";

import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

import {Navigation} from "./features/navigation/Navigation";
import {PlayGameRoute} from "./features/play_game/PlayGame";
import {RecentGames} from "./features/game/RecentGames";

function App() {
    return (
        <>
            <Router>
                <Navigation/>
                <div className="App">
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
                    </Switch>
                </div>

            </Router>
        </>

    );
}

export default App;

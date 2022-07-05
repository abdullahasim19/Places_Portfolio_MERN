import React from 'react';
import {BrowserRouter as Router,Redirect,Route,Switch} from 'react-router-dom';
import UserPlaces from './places/pages/UserPlaces';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';

function App() {
  return(
    <Router>
     <MainNavigation/>
     <main>
      <Switch>
      <Route path="/" exact>
        <Users/>
      </Route>
      <Route path="/:userId/places" exact>
        <UserPlaces/>
      </Route>
      <Route path="/places/new" exact>
        <NewPlace/>
      </Route>
      <Redirect to="/"/>
      </Switch>
      </main>
    </Router>
  );
}

export default App;

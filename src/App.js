import React from 'react';
import {BrowserRouter as Router,Redirect,Route,Switch} from 'react-router-dom';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePage from './places/pages/UpdatePage';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './users/pages/Auth';

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
      <Route path="/places/:placeId">
        <UpdatePage/>
      </Route>
      <Route path="/auth">
        <Auth/>
      </Route>
      <Redirect to="/"/>
      </Switch>
      </main>
    </Router>
  );
}

export default App;

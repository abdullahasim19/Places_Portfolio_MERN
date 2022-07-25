import React,{useState,useCallback} from 'react';
import {BrowserRouter as Router,Redirect,Route,Switch} from 'react-router-dom';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePage from './places/pages/UpdatePage';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Auth from './users/pages/Auth';
import {AuthContext} from './shared/context/auth-context';

function App() {
  const[isLoggedIn,setIsLoggedIn]=useState(false);
  const [userId,setUserid]=useState(null);

  const login=useCallback((uid)=>{
    setIsLoggedIn(true);
    setUserid(uid);
  },[])

  const logout=useCallback((uid)=>{
    setIsLoggedIn(false);
    setUserid(null);
  },[])

  let routes;

  if(isLoggedIn)
  {
      routes=(
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
        <Redirect to="/"/>
      </Switch>
      );
  }
  else
  {
      routes= (
        <Switch>
        <Route path="/" exact>
          <Users/>
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces/>
          </Route>
        <Route path="/auth">
          <Auth/>
        </Route>
        <Redirect to="/auth"/>
        </Switch>
      );
  }

  return(
    <AuthContext.Provider value={{isLoggedIn:isLoggedIn,userId:userId,login:login,logout:logout}}>
    <Router>
     <MainNavigation/>
     <main>
      {routes}
      </main>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
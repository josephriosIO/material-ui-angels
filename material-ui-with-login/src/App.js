import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Protected from './components/PrivateRoute/PrivateRoute';
import AdminPage from './components/AdminPage';
import NavBar from './components/Nav/NavBar';
import Profile from './components/Profile/Profile';
import LandingPage from './components/LandingPage/LandingPage';

const App = props => {
  const { pathname } = window.location;

  return (
    <>
      {pathname !== '/' ? <NavBar /> : null}
      <Route exact path='/' component={LandingPage} />
      <Route exact path='/angels' component={Dashboard} />
      <Protected exact path='/admin' component={AdminPage} />
      <Protected exact path='/profile/:id' component={Profile} />
    </>
  );
};
export default App;

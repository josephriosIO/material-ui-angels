import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Protected from './components/PrivateRoute/PrivateRoute';
import AdminPage from './components/AdminPage';
import NavBar from './components/Nav/NavBar';
import Profile from './components/Profile/Profile';

const App = () => {
  return (
    <>
      <NavBar />
      <Route exact path='/' component={Dashboard} />
      <Protected exact path='/admin' component={AdminPage} />
      <Protected exact path='/profile/:id' component={Profile} />
    </>
  );
};
export default App;

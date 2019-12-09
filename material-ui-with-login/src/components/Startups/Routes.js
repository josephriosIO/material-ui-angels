import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import NavBar from './Nav/Navbar';
import Questionaire from './Questionaire/Questionaire';
import Profile from './Profile/Profile';
import Protected from '../PrivateRoute/PrivateRoute';

const Routes = props => {
  return (
    <>
      <NavBar />
      <Route exact path={props.match.path} component={Dashboard} />
      <Protected
        path={`${props.match.path}/questionaire`}
        component={Questionaire}
      />
      <Protected path={`${props.match.path}/profile/:id`} component={Profile} />
    </>
  );
};

export default Routes;

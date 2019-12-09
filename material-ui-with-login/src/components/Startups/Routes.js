import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import NavBar from './Nav/Navbar';
import Questionaire from './Questionaire/Questionaire';
import Profile from './Profile/Profile';

const Routes = props => {
  return (
    <>
      <NavBar />
      <Route exact path={props.match.path} component={Dashboard} />
      <Route
        path={`${props.match.path}/questionaire`}
        component={Questionaire}
      />
      <Route path={`${props.match.path}/profile/:id`} component={Profile} />
    </>
  );
};

export default Routes;

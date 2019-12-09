import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import NavBar from './Nav/Navbar';

const Routes = props => {
  return (
    <>
      <NavBar />
      <Route exact path={props.match.path} component={Dashboard} />
    </>
  );
};

export default Routes;

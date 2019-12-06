import React from 'react';
import { Route } from 'react-router-dom';
import Dashboard from './Dashboard';

const Routes = props => {
  return (
    <>
      <Route exact path={props.match.path} component={Dashboard} />
    </>
  );
};

export default Routes;

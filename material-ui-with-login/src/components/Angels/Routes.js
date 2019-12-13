import React from 'react';
import { Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import AdminPage from './AdminPage';
import Profile from './Profile/Profile';
import NavBar from './Nav/NavBar';
import SeeStartups from './SeeStartups';
import Protected from '../PrivateRoute/PrivateRoute';

const Routes = props => {
  return (
    <>
      <NavBar />
      <Route exact path={props.match.path} component={Dashboard} />

      <Protected
        exact
        path={`${props.match.path}/admin`}
        component={AdminPage}
      />
      <Protected
        exact
        path={`${props.match.path}/profile/:id`}
        component={Profile}
      />
      <Protected
        exact
        path={`${props.match.path}/startups`}
        component={SeeStartups}
      />
    </>
  );
};

export default Routes;

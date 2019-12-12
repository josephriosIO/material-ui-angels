import '@reshuffle/code-transform/macro';
import React from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Redirect, Link } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

const Dashboard = () => {
  const { authenticated, getLoginURL } = useAuth();

  if (authenticated !== undefined) {
    if (authenticated) {
      return <Redirect to='/startups/questionaire' />;
    } else {
      return <Redirect to={'/login?returnTo=%2Fstartups'} />;
    }
  }

  return (
    <>
      <CircularProgress />
    </>
  );
};

export default Dashboard;

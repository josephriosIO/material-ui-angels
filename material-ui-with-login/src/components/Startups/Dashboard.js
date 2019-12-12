import '@reshuffle/code-transform/macro';
import React from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Redirect } from 'react-router-dom';

import CircularProgress from '@material-ui/core/CircularProgress';

const Dashboard = () => {
  const { authenticated, getLoginURL } = useAuth();

  if (authenticated !== undefined) {
    if (authenticated) {
      return <Redirect to='/startups/questionaire' />;
    }
  }

  return (
    <>
      <CircularProgress />
    </>
  );
};

export default Dashboard;

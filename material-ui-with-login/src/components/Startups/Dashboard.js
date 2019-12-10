import '@reshuffle/code-transform/macro';
import React from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Redirect } from 'react-router-dom';

const Dashboard = () => {
  const { authenticated, getLoginURL } = useAuth();
  if (authenticated) {
    return <Redirect to='/startups/questionaire' />;
  }
  return (
    <>
      <p>Get rid of this page and go straight too login screen</p>
    </>
  );
};

export default Dashboard;

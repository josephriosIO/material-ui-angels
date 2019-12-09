import '@reshuffle/code-transform/macro';
import React from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Redirect } from 'react-router-dom';

const Dashboard = () => {
  const { authenticated } = useAuth();
  if (authenticated) {
    return <Redirect to='/startups/questionaire' />;
  }
  return (
    <div>
      <div>
        <h1 style={{ textAlign: 'center' }}>Please Sign in to proceed.</h1>
      </div>
    </div>
  );
};

export default Dashboard;

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Redirect } from 'react-router-dom';
import { getStartup } from '../../../backend/backend';
import CircularProgress from '@material-ui/core/CircularProgress';

const Dashboard = () => {
  const { authenticated } = useAuth();
  const [profile, setProfile] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const user = await getStartup();

      setProfile(...user);
    };
    fetchData();
  }, []);

  if (profile) {
    if (authenticated && !profile.completed) {
      return <Redirect to='/startups/questionaire' />;
    } else if (authenticated && profile.completed) {
      return <Redirect to='/startups/dashboard' />;
    }
  }

  return (
    <>
      <CircularProgress />
    </>
  );
};

export default Dashboard;

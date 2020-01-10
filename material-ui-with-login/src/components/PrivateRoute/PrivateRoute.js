import '@reshuffle/code-transform/macro';
import React from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Route, Redirect } from 'react-router-dom';

const Protected = ({ component: Component, ...rest }) => {
  const { authenticated } = useAuth();

  if (authenticated === undefined) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? <Component {...props} /> : <Redirect to='/' />
      }
    />
  );
};

export default Protected;

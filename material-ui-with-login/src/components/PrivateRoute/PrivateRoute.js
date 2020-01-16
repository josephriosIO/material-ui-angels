import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import { getRole } from '../../../backend/backend';
import { useAuth } from '@reshuffle/react-auth';
import { Route, Redirect } from 'react-router-dom';

const Protected = ({ component: Component, ...rest }) => {
  const { authenticated } = useAuth();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const roles = await getRole();

      setRoles(roles);
    };
    fetchData();
  }, []);

  if (authenticated === undefined) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} userRoles={roles} />
        ) : (
          <Redirect to='/' />
        )
      }
    />
  );
};

export default Protected;

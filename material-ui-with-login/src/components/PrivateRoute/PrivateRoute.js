import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { Route, Redirect } from 'react-router-dom';
import axios from 'axios';

const Protected = ({ component: Component, ...rest }) => {
  const { authenticated } = useAuth();
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const test = await axios('api/users/createOrGetUser');
      const roles = await axios('/api/users/getroles');

      setRoles(roles.data);
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

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { getAllAngels, createOrGetUser } from '../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import EmptyState from '../EmptyStates/EmptyState';
import { Redirect } from 'react-router-dom';
import DashboardTable from './DashboardTable';
import DashboardAngelsList from './DashboardAngelsList';

const useStyles = makeStyles(theme => ({
  heroContent: {
    marginTop: '60px',
    padding: '64px 25px',
    [theme.breakpoints.down('md')]: {
      marginTop: '30px',
    },
  },
}));

export default function Dashboard({ userRoles }) {
  const [users, setUsers] = useState(undefined);
  const [userData, setUserData] = useState(undefined);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const signedInUser = await createOrGetUser();

        if (userRoles.ADMIN || userRoles.ANGEL) {
          const result = await getAllAngels();
          setUsers(result);
        }

        setUserData(signedInUser);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userRoles]);

  if (userRoles === undefined) {
    return null;
  }

  if (!userRoles.ADMIN && !userRoles.ANGEL) {
    return (
      <EmptyState
        title={'Thank you for your request!'}
        subtitle={
          'An Admin will accept you shortly if you meet the requirements.'
        }
        roles={userRoles}
      />
    );
  }

  if (users === undefined) {
    return null;
  }

  if (userRoles.ADMIN) {
    return (
      <>
        <CssBaseline />
        <Container
          maxWidth='lg'
          component='main'
          className={classes.heroContent}
        >
          {users.length > 0 ? (
            <div>
              <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                community members
              </p>
              <DashboardAngelsList angels={users} />
            </div>
          ) : (
            <EmptyState
              title={'Admin View'}
              subtitle={'Accept some angels.'}
              roles={userRoles}
            />
          )}
        </Container>
      </>
    );
  }

  if (userData !== undefined && !userData.editedProfile) {
    return <Redirect to={`/angels/profile/${userData.id}`} />;
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='lg' component='main' className={classes.heroContent}>
        <DashboardTable users={users} />
      </Container>
    </React.Fragment>
  );
}

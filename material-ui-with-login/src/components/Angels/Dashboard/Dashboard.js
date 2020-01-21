import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { getAllAngels, createOrGetUser } from '../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import EmptyState from '../EmptyStates/EmptyState';
import { Redirect } from 'react-router-dom';
import DashboardAngelsList from './DashboardAngelsList';
import SearchBar from '../HelperComponents/SearchBar';

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
  const [filter, setFilter] = useState([]);
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

  if (userRoles === undefined) return null;

  const search = e => {
    if (e.target.value.length < 2) {
      setFilter([]);
      return null;
    }
    const filteredUsers = users.filter(user => {
      if (user.name.toLowerCase().includes(e.target.value)) {
        return user;
      }

      return null;
    });

    setFilter(filteredUsers);
  };

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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}
              >
                <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>
                  Community Members
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <SearchBar search={search} title={'Name'} />
                </div>
              </div>

              <DashboardAngelsList
                angels={filter.length > 0 ? filter : users}
              />
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
          }}
        >
          <p style={{ textAlign: 'center', textTransform: 'uppercase' }}>
            Community Members
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <SearchBar search={search} title={'Name'} />
          </div>
        </div>
        <DashboardAngelsList angels={filter.length > 0 ? filter : users} />
      </Container>
    </React.Fragment>
  );
}

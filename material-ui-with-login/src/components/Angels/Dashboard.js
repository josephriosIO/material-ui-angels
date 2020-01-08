import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { getAllAngels, getRole, getMeetings } from '../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import EmptyState from './EmptyState';
import DashboardTable from './DashboardTable';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  tableWrapper: {
    maxHeight: 440,
    overflow: 'auto',
  },
}));

export default function Page() {
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const { loading } = useAuth();
  const [roles, setRoles] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const roles = await getRole();
 

      if (roles.ANGEL || roles.ADMIN) {
        const result = await getAllAngels();
        setUsers(result);
      }
      
      if (roles.ADMIN) {
        const test = await getMeetings();
        console.log(test);
      }

      setRoles(roles);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  // wait for the user data to load.
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (roles.ADMIN) {
    return (
      <>
        <CssBaseline />
        <Container
          maxWidth='lg'
          component='main'
          className={classes.heroContent}
        >
          {users.length > 0 ? (
            <DashboardTable users={users} />
          ) : (
            <EmptyState
              title={'Admin View'}
              subtitle={'Accept some angels.'}
              roles={roles}
            />
          )}
        </Container>
      </>
    );
  }

  if (!roles.ANGEL && !roles.ADMIN) {
    return (
      <EmptyState
        title={'Thank you for your request!'}
        subtitle={
          'An Admin will accept you shortly if you meet the requirements.'
        }
        roles={roles}
      />
    );
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

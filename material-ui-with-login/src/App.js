import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { testing, getUsers } from '../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';

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
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: 'wrap',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
}));

export default function Page() {
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const {
    loading,
    authenticated,
    profile,
    getLoginURL,
    getLogoutURL,
  } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUsers();
      if (result) {
        setUsers(result);
      }
    };
    fetchData();
  }, []);

  // wait for the user data to load.
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (authenticated) {
    testing(profile.displayName, profile.picture).then(user => setUsers(user));
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar
        position='static'
        color='default'
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant='h6'
            color='inherit'
            noWrap
            className={classes.toolbarTitle}
          >
            Company name
          </Typography>
          <nav>
            {users.length > 0 && authenticated
              ? users.map(user =>
                  user.admin && user.id === profile.id ? (
                    <Link
                      variant='button'
                      color='textPrimary'
                      href='#'
                      className={classes.link}
                    >
                      Admin
                    </Link>
                  ) : null,
                )
              : null}
          </nav>
          {authenticated ? (
            <>
              <Button
                color='primary'
                variant='outlined'
                className={classes.link}
                href={getLogoutURL()}
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              color='primary'
              variant='outlined'
              className={classes.link}
              href={getLoginURL()}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <Typography
          component='h1'
          variant='h2'
          align='center'
          color='textMain'
          gutterBottom
        >
          {users.length > 0 ? (
            users.map(user => (
              <div>
                {user.name} <img src={user.img} alt={user.name} />
              </div>
            ))
          ) : (
            <Typography
              component='h1'
              variant='h2'
              align='center'
              color='textSecondary'
              gutterBottom
            >
              No users
            </Typography>
          )}
        </Typography>
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
}

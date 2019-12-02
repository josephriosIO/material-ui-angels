import React from 'react';
import { useAuth } from '@reshuffle/react-auth';

import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';

function Copyright() {
  return (
    <Typography variant='body2' color='textSecondary' align='center'>
      Copyright ©&nbsp;
      <Link color='inherit' href='https://material-ui.com/'>
        Your Website
      </Link>
      &nbsp;{new Date().getFullYear()}.
    </Typography>
  );
}

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
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(8),
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
    },
  },
}));

export default function Page() {
  const classes = useStyles();
  const {
    loading,
    error,
    authenticated,
    profile,
    getLoginURL,
    getLogoutURL,
  } = useAuth();

  // wait for the user data to load.
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }
  console.log('profile:', profile);
  let mainText = ``;
  let buttonText = 'Login';
  // this does not work:

  if (authenticated) {
    mainText = `Welcome!! ${profile.displayName}`;
    buttonText = 'Logout';
  }

  function toLoginOrOut(e) {
    if (!authenticated) {
      window.location.href = getLoginURL();
    } else {
      window.location.href = getLogoutURL();
    }
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
            <Link
              variant='button'
              color='textPrimary'
              href='#'
              className={classes.link}
            >
              Admin
            </Link>
          </nav>
          <Button
            onClick={toLoginOrOut}
            href='#'
            color='primary'
            variant='outlined'
            className={classes.link}
          >
            {buttonText}
          </Button>
        </Toolbar>
      </AppBar>
      {/* Hero unit */}
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <Typography
          component='h1'
          variant='h2'
          align='center'
          color='textSecondary'
          gutterBottom
        >
          Users signed up
        </Typography>
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
}

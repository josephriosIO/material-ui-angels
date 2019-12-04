import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { setUsersToBackend, getUsers } from '../../../backend/backend';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Popper from '@material-ui/core/Popper';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import { NavLink } from 'react-router-dom';

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
    margin: theme.spacing(0.5, 0.5),
    textDecoration: 'none',
    fontSize: '.9rem',
    color: 'black',
  },
}));

const Navbar = () => {
  const [users, setUsers] = useState([]);
  const classes = useStyles();
  const { authenticated, profile, getLoginURL, getLogoutURL } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUsers();
      if (result) {
        setUsers(result);
      }
    };
    fetchData();
  }, []);

  //bad always hitting backend
  if (authenticated) {
    setUsersToBackend(profile.displayName, profile.picture).then(user =>
      setUsers(user),
    );
  }
  return (
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
          <NavLink style={{ textDecoration: 'none', color: 'black' }} to='/'>
            Angel's List
          </NavLink>
        </Typography>
        <nav>
          {users.length > 0 && authenticated
            ? users.map(user =>
                user.admin && user.id === profile.id ? (
                  <div key={user.id} style={{ marginRight: '10px' }}>
                    <NavLink
                      className={classes.link}
                      to={{
                        pathname: `/admin`,
                        state: {
                          users: users,
                        },
                      }}
                    >
                      <Button
                        color='secondary'
                        variant='outlined'
                        className={classes.link}
                      >
                        Admin
                      </Button>
                    </NavLink>
                  </div>
                ) : null,
              )
            : null}
        </nav>
        {authenticated ? (
          <>
            <Popper
              open={open}
              anchorEl={anchorEl}
              placement='bottom-end'
              transition
            >
              {({ TransitionProps }) => (
                <Fade {...TransitionProps} timeout={350}>
                  <Paper
                    style={{
                      display: 'flex',
                      flexFlow: 'column',
                      width: '100%',
                    }}
                  >
                    <Typography variant='h8' color='inherit'>
                      Welcome {profile.displayName}
                    </Typography>
                    <Button
                      color='primary'
                      variant='outlined'
                      className={classes.link}
                      href={getLogoutURL()}
                    >
                      Logout
                    </Button>
                  </Paper>
                </Fade>
              )}
            </Popper>

            <Avatar
              style={{ cursor: 'pointer' }}
              aria-describedby={id}
              type='button'
              onClick={handleClick}
              src={profile.picture}
              alt={profile.name}
            />
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
  );
};

export default Navbar;

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import Profile from '../Profile/Profile';
import { useAuth } from '@reshuffle/react-auth';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { setUsersToBackend, getUsers } from '../../../backend/backend';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
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
  const [addedUser, setAddedUser] = useState(true);
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

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (authenticated && addedUser) {
    setUsersToBackend(profile).then(user => setUsers(user));
    setAddedUser(false);
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
            Angels Group
          </NavLink>
        </Typography>
        <nav></nav>
        {authenticated ? (
          <>
            <Menu
              id='simple-menu'
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                {' '}
                Welcome {profile.displayName}!
              </MenuItem>
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              {users.length > 0 && authenticated
                ? users.map(user =>
                    user.admin && user.id === profile.id ? (
                      <div key={user.id} style={{ marginRight: '10px' }}>
                        <NavLink
                          style={{ textDecoration: 'none', color: 'black' }}
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
              <Button
                color='primary'
                variant='outlined'
                className={classes.link}
                href={getLogoutURL()}
              >
                Logout
              </Button>
            </Menu>

            <Avatar
              aria-describedby={id}
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

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { setUsersToBackend, getUsers } from '../../../../backend/backend';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
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
    justifyContent: 'space-between',
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  logo: {
    color: 'black',
    display: 'flex',
    alignItems: 'baseline',
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
        <div className={classes.logo}>
          <NavLink
            style={{ textDecoration: 'none', color: 'black' }}
            to='/angels'
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span>MeetAngels</span>
              <span>
                <AllInclusiveIcon />
              </span>
            </div>
          </NavLink>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
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
                <NavLink
                  style={{ textDecoration: 'none', color: 'black' }}
                  className={classes.link}
                  to={`/angels/profile/${profile.id}`}
                >
                  <Button
                    color='primary'
                    variant='outlined'
                    className={classes.link}
                  >
                    Profile
                  </Button>
                </NavLink>

                <NavLink
                  style={{ textDecoration: 'none', color: 'black' }}
                  className={classes.link}
                  to={`/angels/startups`}
                >
                  <Button
                    color='primary'
                    variant='outlined'
                    className={classes.link}
                  >
                    See Startups
                  </Button>
                </NavLink>

                {users.length > 0 && authenticated
                  ? users.map(user =>
                      user.admin && user.id === profile.id ? (
                        <div key={user.id} style={{ marginRight: '10px' }}>
                          <NavLink
                            style={{ textDecoration: 'none', color: 'black' }}
                            className={classes.link}
                            to={{
                              pathname: `/angels/admin`,
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
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

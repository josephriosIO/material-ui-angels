import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import { createOrGetUser, getRole } from '../../../../backend/backend';
import Toolbar from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import { Link, NavLink } from 'react-router-dom';

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
    color: 'black !important',
    cursor: 'pointer',
    
    '&:hover': {
      textDecoration: 'none',
    },
  },
}));

const Navbar = () => {
  const classes = useStyles();
  const [user, setUser] = useState([]);
  const [roles, setRoles] = useState({});
  const [addedUser, setAddedUser] = useState(true);
  const { authenticated, getLoginURL, getLogoutURL } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  useEffect(() => {
    const fetchData = async () => {
      const result = await createOrGetUser();
      const roles = await getRole();

      setRoles(roles);
      setUser(result);
    };
    fetchData();
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (authenticated && addedUser) {
    createOrGetUser();

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
          <Link style={{ textDecoration: 'none', color: 'black' }} to='/angels'>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <span>J-Ventures </span>
              <span>
                <AllInclusiveIcon style={{ marginLeft: '3px', fontSize: '1rem' }}/>
              </span>
            </div>
          </Link>
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
            <div style={{ 'marginTop': '1px' }}>
              <NavLink 
                       style={{ marginRight: '20px', textDecoration: 'none', color: 'black' }}
                       className={classes.link}
                       to={{
                         pathname: `/angels`,
                       }}
                      >
                  Community
              </NavLink>
            </div>
              {roles.ADMIN ? (
                  <div style={{ 'marginTop': '1px' }}>
                    <NavLink
                      activeStyle={{ fontWeight: 'bold' }}
                      style={{ marginRight: '20px', textDecoration: 'none', color: 'black' }}
                      className={classes.link}
                      to={{
                        pathname: `/angels/admin`,
                      }}
                    >
                      Admin
                    </NavLink>
                  </div>
                ) : null}
              <NavLink
                activeStyle={{ fontWeight: 'bold' }}
                style={{ color: 'black', marginRight: '20px', textDecoration: 'none' }}
                to={`/angels/startups`}
              >
                <p className={classes.link}> Meetings</p>
              </NavLink>
              <Menu
                id='simple-menu'
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Welcome {user.name}!</MenuItem>
                <Link
                  style={{ textDecoration: 'none', color: 'black' }}
                  className={classes.link}
                  to={`/angels/profile/${user.id}`}
                >
                  Profile
                </Link>
                <a className={classes.link} href={getLogoutURL()}>
                  Logout
                </a>
              </Menu>

              <Avatar
                style={{ cursor: 'pointer' }}
                aria-describedby={id}
                onClick={handleClick}
                src={user.img}
                alt={user.name}
              />
            </>
          ) : (
            <p className={classes.link} href={getLoginURL()}>
              Login
            </p>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

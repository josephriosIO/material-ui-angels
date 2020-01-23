import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import GroupIcon from '@material-ui/icons/Group';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';
import { useAuth } from '@reshuffle/react-auth';
import { Redirect } from 'react-router-dom';
import { hasCredentials } from '../../../backend/backend';
import EnvKeyBanner from '../EnvKeyBanner';
import axios from 'axios';

const useStyles = makeStyles({
  title: {
    color: 'black',
    fontSize: '38px',
    lineHeight: 1.05,
    fontWeight: 800,
    textAlign: 'center',
  },
  logo: {
    color: 'black',
    display: 'flex',
    alignItems: 'baseline',
  },
  header: {
    width: '100%',
    height: '300px',
    padding: '10px 30px',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bodyMobile: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileBodyItems: {
    display: 'flex',
    flexFlow: 'column',
    width: '85%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '30px',
  },
  bodyHeaders: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  bodyHeadersMobile: {
    flexFlow: 'column-reverse',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '2.5rem' /* Footer height */,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerMobile: {
    bottom: 0,
    width: '100%',
    height: '3.5rem' /* Footer height */,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const ColorButton = withStyles(theme => ({
  root: {
    color: '#494949 !important',
    textTransform: 'uppercase',
    textDecoration: 'none',
    background: '#fff',
    padding: '20px',
    border: '4px solid #494949 !important',
    display: 'inline-block',
    transition: 'all 0.4s ease 0s',
    '&:hover': {
      color: '#ffffff !important',
      background: '#f6b93b',
      borderColor: '#f6b93b !important',
      transition: 'all 0.4s ease 0s',
    },
  },
}))(Button);

const LandingPage = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:800px)');
  const { getLoginURL, authenticated } = useAuth();
  const [roles, setRoles] = useState([]);
  const [hasCreds, setHasCreds] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const creds = await hasCredentials();
        setHasCreds(creds)
        const roles = await axios('/api/users/getroles');
        setRoles(roles.data);

      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  if (authenticated === undefined) return null;

  if (roles?.ANGEL || roles?.ADMIN) {
    return <Redirect to='/angels' />;
  }

  return (
    <>
      {!hasCreds && (
        <EnvKeyBanner />
      )}
      <div className={classes.header}>
        <div className={classes.logo}>
          <p>J-Ventures</p>
          <span>
            <AllInclusiveIcon />
          </span>
        </div>

        <h1 className={classes.title}>Mensch empowered VC</h1>
      </div>
      <div className={`${matches ? classes.body : classes.bodyMobile}`}>
        <div className={`${matches ? null : classes.mobileBodyItems}`}>
          <div
            className={`${
              matches ? classes.bodyHeaders : classes.bodyHeadersMobile
              }`}
          >
            <h2>Startups</h2>
            <span>
              <GroupIcon />
            </span>
          </div>
          <p>
            Login and set up your startups profile to start meeting angels
            today!
          </p>
          <ColorButton
            href={getLoginURL(`${window.location.origin.toString()}/startups`)}
          >
            Login As Startup
          </ColorButton>
        </div>

        <div className={`${matches ? null : classes.mobileBodyItems}`}>
          <div
            className={`${
              matches ? classes.bodyHeaders : classes.bodyHeadersMobile
              }`}
          >
            <h2>J-Ventures members</h2>
            <span>
              <TrendingUpIcon />
            </span>
          </div>

          <p>A member of our Capitalist Kibbutz.</p>
          <ColorButton
            href={getLoginURL(`${window.location.origin.toString()}/angels`)}
          >
            Member Login
          </ColorButton>
        </div>
      </div>
      <footer className={`${matches ? classes.footer : classes.footerMobile}`}>
        <p>
          Powered by <a href='https://reshuffle.com'>Reshuffle</a>
        </p>
      </footer>
    </>
  );
};

export default LandingPage;

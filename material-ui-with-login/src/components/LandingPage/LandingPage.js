import '@reshuffle/code-transform/macro';
import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Helmet } from 'react-helmet';
import GroupIcon from '@material-ui/icons/Group';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import AllInclusiveIcon from '@material-ui/icons/AllInclusive';

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

  return (
    <>
      <div className={classes.header}>
        <div className={classes.logo}>
          <p>MeetAngels</p>
          {'  '}
          <span>
            <AllInclusiveIcon />
          </span>
        </div>

        <h1 className={classes.title}>Where Start-ups meet angels</h1>
      </div>
      <div className={`${matches ? classes.body : classes.bodyMobile}`}>
        <div className={`${matches ? null : classes.mobileBodyItems}`}>
          <div
            className={`${
              matches ? classes.bodyHeaders : classes.bodyHeadersMobile
            }`}
          >
            <h2>MeetStartups</h2>
            <span>
              <GroupIcon />
            </span>
          </div>
          <p>
            Login and set up your startups profile to start meeting angels
            today!
          </p>
          <ColorButton href='/startups'>Login As Startup</ColorButton>
        </div>

        <div className={`${matches ? null : classes.mobileBodyItems}`}>
          <div
            className={`${
              matches ? classes.bodyHeaders : classes.bodyHeadersMobile
            }`}
          >
            <h2>MeetAngels</h2>
            <span>
              <TrendingUpIcon />
            </span>
          </div>

          <p>
            By one of the next angel investors that fund the next big company.
          </p>
          <ColorButton href='/angels'>Become An Angel</ColorButton>
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

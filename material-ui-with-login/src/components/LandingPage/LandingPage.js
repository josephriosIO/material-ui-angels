import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const useStyles = makeStyles({
  boxContainer: {
    width: '100%',
    display: 'flex',
    flexFlow: 'row',
    background: 'linear-gradient(160deg, #FE6B8B 30%, #FF8E53 80%)',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  boxContainerMobile: {
    width: '100%',
    display: 'flex',
    flexFlow: 'column',
    background: 'linear-gradient(155deg, #FE6B8B 20%, #FF8E53 65%)',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '38px',
    lineHeight: 1.05,
    fontWeight: 800,
    textAlign: 'center',
  },
  header: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    width: '100%',
    height: '300px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '10px 30px',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    background: 'linear-gradient(40deg, #FE6B8B 20%, #FF8E53 90%)',
    width: '100%',
    height: '300px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '10px 30px',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerMobile: {
    background: 'linear-gradient(360deg, #FE6B8B 30%, #FF8E53 90%)',
    width: '100%',
    height: '300px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    padding: '10px 30px',
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxes: {
    display: 'flex',
    width: '50%',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingBottom: '20px',
    marginBottom: '40px',

    borderRadius: '29px',
  },
  boxesMobile: {
    display: 'flex',
    width: '90%',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    paddingBottom: '20px',
    marginBottom: '40px',

    borderRadius: '29px',
  },
});

const ColorButton = withStyles(theme => ({
  root: {
    color: 'white !important',
    width: '120px',
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    '&:hover': {
      background: 'linear-gradient(180deg, #FE6B8B 10%, #FF8E53 50%)',
    },
  },
}))(Button);

const LandingPage = () => {
  const classes = useStyles();
  const matches = useMediaQuery('(min-width:600px)');

  return (
    <>
      <div className={classes.header}>
        <p>Angels Group</p>
        <h1 className={classes.title}>Where Start-ups meet angels</h1>
      </div>
      <div
        className={`${
          matches ? classes.boxContainer : classes.boxContainerMobile
        }`}
      >
        <div className={`${matches ? classes.boxes : classes.boxesMobile}`}>
          <p>Are you a Start-up?</p>
          <ColorButton>Login</ColorButton>
        </div>

        <div className={`${matches ? classes.boxes : classes.boxesMobile}`}>
          <p>Are you an angel investor?</p>
          <ColorButton href='/angels'>Login</ColorButton>
        </div>
      </div>
      <div className={`${matches ? classes.footer : classes.footerMobile}`}>
        <h1>Bottom Text</h1>
      </div>
    </>
  );
};

export default LandingPage;

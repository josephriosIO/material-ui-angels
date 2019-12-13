import '@reshuffle/code-transform/macro';
import React, { useState } from 'react';
import { updateStatus, makeUserAngel } from '../../../backend/backend';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const useStyles = makeStyles(theme => ({
  infoHolder: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const DisplayUsers = props => {
  const classes = useStyles();
  const { user, callErrors } = props;
  const [state, setState] = useState({
    admin: user.admin,
    angel: user.angel,
  });

  const { admin, angel } = state;

  const handleChangeAdmin = e => {
    setState({ ...state, admin: !admin });
    updateStatus(user.id, !admin, angel);
    callErrors(!admin);
  };

  const handleChangeAngel = e => {
    setState({ ...state, angel: !angel });
    makeUserAngel('yooo');
    updateStatus(user.id, admin, !angel);
    callErrors(!angel);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div className={classes.infoHolder}>
          <Typography
            component='h3'
            variant='h4'
            color='textSecondary'
            gutterBottom
          >
            <div
              style={{
                display: 'flex',
              }}
            >
              <Avatar src={user.img} alt={user.name} />
              <p style={{ marginBottom: '15px' }}>{user.name}</p>
            </div>
          </Typography>
          <div>
            <FormControlLabel
              control={
                <Checkbox
                  onChange={e => handleChangeAdmin(e)}
                  name='admin'
                  checked={admin}
                  value='admin'
                  inputProps={{
                    'aria-label': 'primary checkbox',
                  }}
                />
              }
              label='Admin'
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={angel}
                  onChange={e => handleChangeAngel(e)}
                  name='angel'
                  value='angel'
                  color='primary'
                  inputProps={{
                    'aria-label': 'secondary checkbox',
                  }}
                />
              }
              label='Angel'
            />
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

export default DisplayUsers;

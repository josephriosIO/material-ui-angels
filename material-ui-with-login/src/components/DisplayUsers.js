import '@reshuffle/code-transform/macro';
import React, { useState } from 'react';
import { updateStatus } from '../../backend/backend';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const DisplayUsers = props => {
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
    updateStatus(user.id, admin, !angel);
    callErrors(!angel);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <Typography
            component='h3'
            variant='h4'
            color='textSecondary'
            gutterBottom
          >
            {user.name}
          </Typography>
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
        </Paper>
      </Grid>
    </Grid>
  );
};

export default DisplayUsers;

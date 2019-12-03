import React from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const DisplayUsers = props => {
  const { user } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper>
          <Typography
            component='h3'
            variant='h4'
            align='center'
            color='textSecondary'
            gutterBottom
          >
            {user.name}
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={user.admin}
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
                checked={user.angel}
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

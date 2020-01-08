import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {
  getRolesOfUsers,
  makeUserAdmin,
  makeUserAngel,
} from '../../../backend/backend';

const useStyles = makeStyles(theme => ({
  infoHolder: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid black',
  },
  userInfo: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'flex-start',
  },
}));

const DisplayUsers = props => {
  const classes = useStyles();
  const { user, callErrors } = props;
  const [state, setState] = useState({
    admin: false,
    angel: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      const usersRoles = await getRolesOfUsers(user.id);

      setState({
        admin: usersRoles.ADMIN,
        angel: usersRoles.ANGEL,
      });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const { admin, angel } = state;

  const handleChangeAdmin = e => {
    setState({ ...state, admin: !admin });
    makeUserAdmin(user.id);
    callErrors(!admin);
  };

  const handleChangeAngel = e => {
    setState({ ...state, angel: !angel });
    makeUserAngel(user.id);
    callErrors(!angel);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <div className={classes.infoHolder}>
          <Typography component='subtitle2' variant='subtitle2'>
            <div
              style={{
                display: 'flex',
                flexFlow: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar src={user.img} alt={user.name} />
              <p style={{ marginBottom: '15px' }}>{user.name}</p>
            </div>
          </Typography>

          <div className={classes.userInfo}>
            <label>Email:</label>
            <p>{user.email[0].value}</p>
          </div>
          <div className={classes.userInfo}>
            <label>Location:</label>
            <p>{`${user.location === '' ? 'N/A' : user.location}`}</p>
          </div>

          <div style={{ display: 'flex', flexFlow: 'column' }}>
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

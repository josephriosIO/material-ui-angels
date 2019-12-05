import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { getUser, updateProfile } from '../../../backend/backend';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: 200,
    },
  },
}));

const Profile = props => {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    phoneNumber: '',
  });
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();

      setProfile(...user);
    };
    fetchData();
  }, []);

  const handleSubmits = async event => {
    event.preventDefault();
    await updateProfile(profile);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <React.Fragment>
      <Typography variant='h6' gutterBottom>
        Update Profile
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            onChange={e => onChange(e)}
            defaultValue={profile.name}
            placeholder='Placeholder'
            id='standard-normal'
            name='name'
            label='Name'
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            onChange={e => onChange(e)}
            defaultValue={profile.location}
            id='location'
            name='location'
            label='Location'
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            defaultValue={profile.phoneNumber}
            onChange={e => onChange(e)}
            id='number'
            name='phoneNumber'
            label='Phone Number'
            fullWidth
            autoComplete='phone-number'
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            defaultValue={profile.bio}
            onChange={e => onChange(e)}
            id='bio'
            name='bio'
            label='Bio'
            fullWidth
          />
        </Grid>
        <Button
          onSubmit={e => handleSubmits(e)}
          variant='contained'
          color='primary'
        >
          Submit
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default Profile;

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { getUser, updateProfile } from '../../../../backend/backend';
import Error from '../../Errors/Error';

const Profile = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({
    name: '',
    location: '',
    bio: '',
    phoneNumber: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUser();

      setProfile(...user);

      console.log(user);

      setForm({
        name: user[0].name,
        bio: user[0].bio,
        location: user[0].location,
        phoneNumber: user[0].phoneNumber,
      });
    };
    fetchData();
  }, []);

  const handleSubmits = async event => {
    event.preventDefault();
    await updateProfile(form);
    setErrorMsg('Saved.');
    setErrorStatus('success');
    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!profile) {
    console.error('Profile is empty!');
  }

  return (
    <React.Fragment>
      <Error errorMsg={errorMsg} color={errorStatus} />
      <Typography variant='h6' gutterBottom>
        Update Profile
      </Typography>
      <form onSubmit={handleSubmits}>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              onChange={e => onChange(e)}
              value={form.name}
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
              value={form.location}
              id='location'
              name='location'
              label='Location'
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              value={form.phoneNumber}
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
              value={form.bio}
              onChange={e => onChange(e)}
              id='bio'
              name='bio'
              label='Bio'
              fullWidth
              multiline
              rows='6'
            />
          </Grid>
        </Grid>
        <Grid item xs={12} sm={6} style={{ marginTop: '20px' }}>
          <Button type='submit' variant='contained' color='primary'>
            Submit
          </Button>
        </Grid>
      </form>
    </React.Fragment>
  );
};

export default Profile;

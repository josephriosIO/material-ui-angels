import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { getStartup, updateStartupProfile } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import { useAuth } from '@reshuffle/react-auth';

const Profile = () => {
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [formProfile, setProfile] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    location: '',
    missionStatement: '',
    phoneNumber: '',
    companySize: 0,
    funded: false,
  });
  const { profile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getStartup();

      setProfile(...user);

      setForm({
        companyName: user[0].companyName,
        missionStatement: user[0].missionStatement,
        location: user[0].location,
        phoneNumber: user[0].phoneNumber,
        funded: user[0].funded,
        companySize: user[0].companySize,
      });
    };
    fetchData();
  }, []);

  const handleSubmits = async event => {
    event.preventDefault();
    await updateStartupProfile(form);
    setErrorMsg('Saved.');
    setErrorStatus('success');

    setTimeout(() => {
      setErrorMsg('');
    }, 3000);
    setSubmitted(true);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!formProfile) {
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
              value={form.companyName}
              placeholder='Placeholder'
              id='standard-normal'
              name='CompanyName'
              label='Company Name'
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
              value={form.companySize}
              onChange={e => onChange(e)}
              id='number'
              name='companySize'
              label='Company Size'
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              value={form.funded}
              onChange={e => onChange(e)}
              id='number'
              name='funded'
              label='Funded'
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              value={form.missionStatement}
              onChange={e => onChange(e)}
              id='bio'
              name='missionStatment'
              label='Mission Statement'
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

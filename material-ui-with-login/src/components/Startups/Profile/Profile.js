import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormLabel from '@material-ui/core/FormLabel';
import { getStartup, updateStartupProfile } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: '#f9f9fa',
    height: '100vh',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      maxWidth: '988px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingLeft: '14px',
      paddingRight: '14px',
    },
  },
  header: {
    borderBottom: '1px solid #e7e9eb',
    padding: '56px 0',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItem: 'center',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      justifyContent: 'flex-start',
      flexFlow: 'column',
    },
  },
  saveBtn: {
    backgroundColor: '#3f81c7',
    borderRadius: '3px',
    cursor: 'pointer',
    display: 'inline-block',
    fontSize: '14px',
    lineHeight: '21px',
    padding: '7px 26px',
    outline: 'none',
    textDecoration: 'none',
    textAlign: 'center',
    userSelect: 'none',
    color: '#f0f0f0',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      padding: '7px 18px',
      width: '100px',
    },
  },
}));

const Profile = () => {
  const classes = useStyles();
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
    try {
      event.preventDefault();
      await updateStartupProfile(form);
      setErrorMsg('Saved.');
      setErrorStatus('success');

      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
      setSubmitted(true);
    } catch (err) {
      setErrorMsg('Please be logged into the right account.');
      setErrorStatus('danger');
      console.error(submitted);
      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
      setSubmitted(true);
    }
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!formProfile) {
    console.error('Profile is empty!');
  }

  return (
    <div className={classes.container}>
      <Error errorMsg={errorMsg} color={errorStatus} />
      <form onSubmit={handleSubmits}>
        <div className={classes.layout}>
          <div className={classes.header}>
            <Typography variant='h6' gutterBottom>
              {form.companyName} / Edit Profile
            </Typography>
            <button
              type='submit'
              variant='contained'
              className={classes.saveBtn}
            >
              Save
            </button>
          </div>

          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                onChange={e => onChange(e)}
                value={form.companyName}
                id='companyName'
                name='companyName'
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
                id='companySize'
                type='number'
                name='companySize'
                label='Company Size'
                inputProps={{
                  step: 1,
                  min: 0,
                  max: 100,
                  type: 'number',
                  'aria-labelledby': 'input-slider',
                }}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <RadioGroup
                aria-label='position'
                name='funded'
                value={form.funded}
                onChange={e => onChange(e)}
                row
              >
                <FormLabel component='legend'>Funded</FormLabel>
                <FormControlLabel
                  value='true'
                  control={<Radio color='primary' />}
                  label='True'
                  labelPlacement='top'
                />
                <FormControlLabel
                  value='false'
                  control={<Radio color='primary' />}
                  label='False'
                  labelPlacement='top'
                />
              </RadioGroup>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                value={form.missionStatement}
                onChange={e => onChange(e)}
                id='missionStatement'
                name='missionStatement'
                label='Mission Statement'
                fullWidth
                multiline
                rows='6'
              />
            </Grid>
          </Grid>
        </div>
      </form>
    </div>
  );
};

export default Profile;

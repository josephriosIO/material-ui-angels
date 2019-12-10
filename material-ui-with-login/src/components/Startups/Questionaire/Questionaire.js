import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { updateStartupProfile, getStartup } from '../../../../backend/backend';
import Error from '../../Errors/Error';
import { Redirect } from 'react-router-dom';
import { useAuth } from '@reshuffle/react-auth';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(6),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  flex: {
    display: 'flex',
    flexFlow: 'column',
  },
}));

const Questionaire = () => {
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

  if (formProfile.startup && formProfile.companyName.length > 1) {
    if (profile) {
      return <Redirect to={`/startups/profile/${profile.id}`} />;
    }
  }

  return (
    <div className={classes.layout}>
      <Paper className={classes.paper}>
        {submitted ? <Redirect to={`/startups/profile/${profile.id}`} /> : null}
        <Error errorMsg={errorMsg} color={errorStatus} />
        <Paper style={{ marginBottom: '40px' }}>
          <Typography variant='h6' gutterBottom style={{ textAlign: 'center' }}>
            Fill out some info about your startup below!
          </Typography>
        </Paper>
        <Grid container spacing={6} justify='center' alignItems='center'>
          <form onSubmit={handleSubmits}>
            <Grid item xs={12}>
              <div className={classes.flex}>
                <label>What is your companys name?</label>
                <TextField
                  value={form.companyName}
                  onChange={e => onChange(e)}
                  name='companyName'
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.flex}>
                <label>What is your company located?</label>
                <TextField
                  value={form.location}
                  onChange={e => onChange(e)}
                  name='location'
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.flex}>
                <label>How many people does your company employee?</label>
                <TextField
                  value={form.companySize}
                  onChange={e => onChange(e)}
                  name='companySize'
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.flex}>
                <label>Is the company funded?</label>
                <div style={{ display: 'flex' }}>
                  <RadioGroup
                    aria-label='position'
                    name='funded'
                    value={form.funded}
                    onChange={e => onChange(e)}
                    row
                  >
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
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.flex}>
                <label>What is your companys mission statement?</label>
                <TextField
                  value={form.missionStatement}
                  onChange={e => onChange(e)}
                  name='missionStatement'
                  multiline
                  rows='4'
                />
              </div>
            </Grid>
            <Grid
              style={{ margin: '20px 0' }}
              item
              xs={12}
              container
              justify='center'
              alignItems='center'
            >
              <Button variant='contained' color='primary' type='submit'>
                submit
              </Button>
            </Grid>
          </form>
        </Grid>
      </Paper>
    </div>
  );
};
export default Questionaire;

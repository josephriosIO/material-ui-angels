import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import {
  updateStartupProfile,
  createOrGetStartup,
} from '../../../../backend/backend';
import Error from '../../Errors/Error';
import { Redirect } from 'react-router-dom';
import { useAuth } from '@reshuffle/react-auth';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const employeesValues = [
  '0 - 10',
  '11 - 50',
  '51 - 200',
  '201 - 500',
  '501 - 1000',
  '1000+',
];

const useStyles = makeStyles(theme => ({
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

  flex: {
    display: 'flex',
    flexFlow: 'column',
    marginBottom: '10px',
    padding: '0 20px',
  },
  btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '30px 0',
    padding: '0 20px',
  },
  header: {
    background: '#eee',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
  },
  formContainer: {
    border: '1px solid #e7e9eb',
    padding: '28px',
  },
  footer: {
    marginTop: '100px',
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
    website: '',
  });
  const { profile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const startup = await createOrGetStartup();
      setProfile(startup);

      setForm({
        companyName: startup.companyName,
        missionStatement: startup.missionStatement,
        location: startup.location,
        phoneNumber: startup.phoneNumber,
        funded: startup.funded,
        companySize: startup.companySize,
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

  if (formProfile.completed) {
    if (profile) {
      return <Redirect to={`/startups/dashboard`} />;
    }
  }

  return (
    <div>
      {submitted ? <Redirect to={`/startups/dashboard`} /> : null}
      <Error errorMsg={errorMsg} color={errorStatus} />
      <div className={classes.header}>
        <h2 style={{ fontSize: '1rem' }}>Create a Startup Profile</h2>
      </div>
      <div className={classes.layout}>
        <div className={classes.formContainer}>
          <form onSubmit={handleSubmits}>
            <div className={classes.flex}>
              <label>Company Name</label>
              <TextField
                value={form.companyName}
                onChange={e => onChange(e)}
                name='companyName'
              />
            </div>
            <div className={classes.flex}>
              <label>Company Website</label>
              <TextField
                value={form.website}
                onChange={e => onChange(e)}
                name='website'
              />
            </div>
            <div className={classes.flex}>
              <label>Location</label>
              <TextField
                value={form.location}
                onChange={e => onChange(e)}
                name='location'
              />
            </div>
            <div className={classes.flex}>
              <label># of Employees</label>
              <TextField
                value={form.companySize}
                onChange={e => onChange(e)}
                name='companySize'
                select
              >
                {employeesValues.map(option => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </div>
            <div className={classes.flex}>
              <label>What is your company's mission statement?</label>
              <TextField
                value={form.missionStatement}
                onChange={e => onChange(e)}
                name='missionStatement'
                multiline
                rows='4'
                variant='outlined'
              />
            </div>
            <div className={classes.btn}>
              <div>
                <Button variant='contained' color='primary' type='submit'>
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </div>
        <footer className={classes.footer}>
          <p>Powered By Reshuffle</p>
        </footer>
      </div>
    </div>
  );
};
export default Questionaire;

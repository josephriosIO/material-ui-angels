import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {
  getAllVettedStartups,
  getRole,
  createMeeting,
  archiveStartup,
} from '../../../backend/backend';
import SearchBar from './SearchBar';
import StartupDataTable from './StartupDataTable';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Error from '../Errors/Error';
import Snackbar from '@material-ui/core/Snackbar';
import { Link } from 'react-router-dom';

import 'react-datepicker/dist/react-datepicker.css';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  header: {
    borderBottom: '1px solid #e7e9eb',
    padding: '30px 0',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      alignItems: 'center',
      flexFlow: 'column',
    },
  },
  headerTitle: {
    textAlign: 'center',
    paddingTop: '10px',
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
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  tableWrapper: {
    maxHeight: '100%',
    zIndex: '-10',
    overflow: 'auto',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

const MeetingCreator = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = useState({
    title: '',
  });
  const [createdMeeting, setCreatedMeeting] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [error, setError] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      const usersRoles = await getRole();

      if (usersRoles.ADMIN || usersRoles.ANGEL) {
        const result = await getAllVettedStartups();
        setUsers(result);
      }

      setRoles(usersRoles);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleChange = date => {
    setStartDate(date);
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const startupsInMeeting = startup => {
    const ids = createdMeeting.map(startups => startups.id);
    if (ids.includes(startup.id)) {
      return;
    }
    setCreatedMeeting([...createdMeeting, startup]);
  };

  const removeStartupFromMeeting = startup => {
    var index = createdMeeting.indexOf(startup);
    if (index > -1) {
      createdMeeting.splice(index, 1);
    }
    setCreatedMeeting([...createdMeeting]);
  };

  const search = e => {
    const filteredUsers = users.filter(user => {
      if (user.companyName.toLowerCase().includes(e.target.value)) {
        return user;
      }

      return null;
    });

    setFilter(filteredUsers);
  };

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  if (!roles.ADMIN) {
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>Only Admins can see this view.</p>
      </div>
    );
  }

  if (users.length < 1) {
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>No Startups that has been vetted :(</p>
        <p className='empty-subtitle'>
          Go vet some startups <Link to='/angels/startups'>here</Link>
        </p>
      </div>
    );
  }

  const saveMeeting = async () => {
    if (createdMeeting.length < 1) {
      setErrorMsg('Please add startups for meeting.');
      setErrorStatus('error');
      handleClick();
      return;
    }

    if (form.title.length < 1) {
      setError(!error);
      return;
    }

    const data = {
      title: form.title,
      startups: createdMeeting,
      date: startDate,
    };
    setErrorMsg('Saved Meeting.');
    setErrorStatus('success');
    handleClick();
    createdMeeting.map(async startup => {
      await archiveStartup(startup.id);
    });
    return await createMeeting(data);
  };

  return (
    <div>
      <span>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={5000}
          onClose={handleClose}
        >
          <Error
            onClose={handleClose}
            variant={errorStatus}
            message={errorMsg}
          />
        </Snackbar>
      </span>
      <div>
        <Typography className={classes.headerTitle} variant='h6'>
          Meeting Creator
        </Typography>
        <div className={classes.header}>
          <div>
            <Typography variant='h6'>Pick Date for meeting</Typography>
            <DatePicker
              minDate={new Date()}
              selected={startDate}
              onChange={handleChange}
            />
          </div>
          <div>
            <TextField
              error={error}
              label='Meeting Title'
              helperText={error && 'Please have a meeting title'}
              onChange={e => onChange(e)}
              value={form.title}
              id='title'
              name='title'
            />
          </div>
          <button
            onClick={saveMeeting}
            variant='contained'
            className={classes.saveBtn}
          >
            Save
          </button>
        </div>
      </div>
      <div>
        <div>
          {createdMeeting.length > 0 ? (
            <>
              <h2>Selected startups</h2>
              {createdMeeting.map(startup => (
                <div key={startup.id} style={{ display: 'flex' }}>
                  <h6>{startup.companyName}</h6>
                  <span onClick={() => removeStartupFromMeeting(startup)}>
                    X
                  </span>
                </div>
              ))}
            </>
          ) : null}
        </div>
        <Grid>
          <div className={classes.root}>
            <div className={classes.flex}>
              <h2>Startups</h2>
              <SearchBar search={search} title={'Company Name'} />
            </div>
            <div className={classes.tableWrapper}>
              <StartupDataTable
                isAdded={createdMeeting}
                users={filter.length > 1 ? filter : users}
                callback={startupsInMeeting}
              />
            </div>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default MeetingCreator;

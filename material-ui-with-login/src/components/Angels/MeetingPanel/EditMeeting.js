import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import {
  getAllVettedStartups,
  getRole,
  updateMeeting,
  archiveStartup,
  getMeeting,
} from '../../../../backend/backend';
import SearchBar from '../HelperComponents/SearchBar';
import StartupDataTable from './StartupDataTable';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Error from '../../Errors/Error';
import Snackbar from '@material-ui/core/Snackbar';
import Chip from '@material-ui/core/Chip';

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
  onlyFlex: {
    display: 'flex',
  },
}));

const EditMeeting = props => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [meeting, setMeeting] = useState({
    startDate: new Date(),
    title: '',
    startups: [],
  });

  const [error, setError] = useState(false);
  const classes = useStyles();
  const { startups, title, startDate } = meeting;

  useEffect(() => {
    const fetchData = async () => {
      const { id } = props.match.params;
      const usersRoles = await getRole();
      const editableMeeting = await getMeeting(id);

      const meeting = editableMeeting.map(({ value }) => value);

      setMeeting({
        ...meeting,
        startDate: new Date(meeting[0].date),
        title: meeting[0].title,
        startups: meeting[0].startups,
      });

      if (usersRoles.ADMIN || usersRoles.ANGEL) {
        const result = await getAllVettedStartups();

        if (result.length < 1) {
          setUsers(meeting[0].startups);
        } else {
          setUsers(result);
        }
      }

      setRoles(usersRoles);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleChange = dateSubmited => {
    setMeeting({ ...meeting, startDate: dateSubmited });
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
    const ids = startups.map(startups => startups.id);
    if (ids.includes(startup.id)) {
      return;
    }
    setMeeting({ ...meeting, startups: [...startups, startup] });
  };

  const removeStartupFromMeeting = startup => {
    var index = startups.indexOf(startup);
    if (index > -1) {
      startups.splice(index, 1);
    }
    setMeeting({ ...meeting, startups: [...startups] });
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

  const onChange = e =>
    setMeeting({ ...meeting, [e.target.name]: e.target.value });

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

  const updateOldMeeting = async () => {
    const { id } = props.match.params;
    if (startups.length < 1) {
      setErrorMsg('Please add startups for meeting.');
      setErrorStatus('error');
      handleClick();
      return;
    }

    if (meeting.title.length < 1) {
      setError(!error);
      return;
    }

    const data = {
      title: meeting.title,
      startups: meeting.startups,
      date: meeting.startDate,
    };
    setErrorMsg('Saved Meeting.');
    setErrorStatus('success');
    handleClick();
    startups.map(async startup => {
      await archiveStartup(startup.id);
    });
    await updateMeeting(data, id);

    setTimeout(function() {
      props.history.push('/angels/meetings');
    }, 3000);
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
              value={title}
              id='title'
              name='title'
            />
          </div>
          <button
            onClick={updateOldMeeting}
            variant='contained'
            className={classes.saveBtn}
          >
            Save
          </button>
        </div>
      </div>
      <div>
        <div style={{ padding: '35px' }}>
          {startups.length > 0 ? (
            <>
              <h2>Selected Startups</h2>
              {startups.map(startup => (
                <div key={startup.id} className={classes.onlyFlex}>
                  <Chip
                    label={startup.companyName}
                    onClick={() => removeStartupFromMeeting(startup)}
                    onDelete={() => removeStartupFromMeeting(startup)}
                  />
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
                isAdded={startups}
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

export default EditMeeting;

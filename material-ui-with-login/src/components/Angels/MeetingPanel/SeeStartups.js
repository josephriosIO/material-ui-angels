import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { getRole, getMeetings } from '../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MeetingPanels from './MeetingPanel';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  link: {
    textDecoration: 'none !important',
    color: '#000 !important',
    borderBottom: '1px solid #000',
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SeeStartups() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [oldMeetings, setOldMeetings] = useState([]);
  const classes = useStyles();
  const { loading } = useAuth();
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const usersRoles = await getRole();

      const result = await getMeetings();

      const sortedDates = result.sort((a, b) => b.date - a.date);

      const newMeetings = sortedDates.filter(d => {
        let meetingDate = new Date(d.date);
        let currentDate = new Date();
        meetingDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);

        return meetingDate >= currentDate;
      });

      const oldDates = sortedDates.filter(d => {
        return new Date(d.date).getTime() <= new Date().getTime();
      });

      setOldMeetings(oldDates);
      setUsers(newMeetings);

      setRoles(usersRoles);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // wait for the user data to load.
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!roles.ADMIN && !roles.ANGEL) {
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>Thank you for your request!</p>
        <p className='empty-subtitle'>
          To see upcoming startups please have an admin confirm you as an angel.
        </p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth='lg' component='main'>
        {users.length < 1 ? (
          <div className='empty'>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>No Meetings</p>
            <p className='empty-subtitle'>
              Ask your admin to create more meetings!
            </p>
            <p className='empty-subtitle'>
              {roles.ADMIN ? (
                <Link
                  className={classes.link}
                  to={{
                    pathname: `/angels/createmeeting`,
                  }}
                >
                  Create Meeting
                </Link>
              ) : null}
            </p>
          </div>
        ) : (
          <Grid>
            <div className={classes.root}>
              <div className={classes.flex}>
                <h2>Meetings</h2>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label='simple tabs example'
                >
                  <Tab label='Upcoming Meetings' {...a11yProps(0)} />

                  <Tab label='Previous Meetings' {...a11yProps(1)} />
                </Tabs>
                {roles.ADMIN ? (
                  <Link
                    className={classes.link}
                    to={{
                      pathname: `/angels/createmeeting`,
                    }}
                  >
                    Create Meeting
                  </Link>
                ) : null}
              </div>
              <TabPanel value={value} index={0}>
                <div>
                  {users.map(startupsData => (
                    <MeetingPanels key={startupsData.id} users={startupsData} />
                  ))}
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <div>
                  {oldMeetings.length < 1 ? (
                    <div className='empty'>
                      <div className='empty-icon'>
                        <i className='icon icon-people'></i>
                      </div>
                      <p className='empty-title h5'>
                        Theres is no previous meetings.
                      </p>
                    </div>
                  ) : (
                    oldMeetings.map(startupsData => (
                      <MeetingPanels
                        key={startupsData.id}
                        users={startupsData}
                      />
                    ))
                  )}
                </div>
              </TabPanel>
            </div>
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
}

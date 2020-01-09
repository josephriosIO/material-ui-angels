import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { getRole, getMeetings } from '../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

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
  row: {
    padding: '16px 16px 0',
    border: '1px solid rgba(0,0,0,.12)',
    margin: '20px 0',
  },
  title: {
    textTransform: 'uppercase',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '-.02em',
    wordSpacing: '.1em',
  },
  date: {
    stroke: 'transparent',
    fill: 'rgba(0,0,0,.87)',
    color: 'rgba(0,0,0,.87)',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: '-.02em',
    wordSpacing: '.1em',
    textTransform: 'uppercase',
  },
  tableWrapper: {
    maxHeight: '100%',
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

export default function SeeStartups() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const classes = useStyles();
  const { loading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const usersRoles = await getRole();

      if (usersRoles.ADMIN || usersRoles.ANGEL) {
        const result = await getMeetings();
        console.log(result);
        const sortedDates = result.sort((a, b) => b.date - a.date);

        setUsers(sortedDates);
      }

      setRoles(usersRoles);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

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
          </div>
        ) : (
          <Grid>
            <div className={classes.root}>
              <div className={classes.flex}>
                <h2>Meetings</h2>
                <Link
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                    borderBottom: '1px solid #000',
                  }}
                  to={{
                    pathname: `/angels/createmeeting`,
                  }}
                >
                  Create Meeting
                </Link>
              </div>
              <div>
                {users.map(startupsData => {
                  const d = new Date(startupsData.date);
                  return (
                    <div key={d}>
                      <div className={classes.row}>
                        <span className={classes.date}>{d.toDateString()}</span>
                        <div className={classes.title}>
                          {startupsData.title}
                        </div>
                        <div style={{ display: 'flex', flexFlow: 'row' }}>
                          {startupsData.startups.map((startup, idx) => (
                            <div key={idx}>
                              <p>{startup.companyName}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Grid>
        )}
      </Container>
    </React.Fragment>
  );
}

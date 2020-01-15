import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import {
  getVotesByMeeting,
  getMeeting,
  getStartupsAndPointsByMeetingId,
} from '../../../../backend/backend';
import { Redirect } from 'react-router-dom';
import AngelUserDisplay from './AngelUserDisplay';
import AngelUsers from './AngelUsers';
import { Doughnut } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid black',
    padding: '20px',
    margin: '20px',
  },
  topContent: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-around',
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '15px',
  },
  userContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '50px',
  },
  startupInfo: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
  },
  companyName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
  },
  bottomContainer: {
    marginTop: '20px',
  },
  bold: {
    fontWeight: 'bold',
  },
}));

const AdminMeetingPanel = props => {
  const [allVotes, setAllVotes] = useState([]);
  const [meeting, setMeeting] = useState({});
  const [reload, setReload] = useState(false);
  const [notVotes, setNoVotes] = useState(false);
  const [startups, setStartups] = useState([]);
  const [points, setPoints] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getVotesByMeeting(props?.location?.meeting?.id);
        const meeting = await getMeeting(props?.location?.meeting?.id);
        const testing = await getStartupsAndPointsByMeetingId(
          props?.location?.meeting?.id,
        );

        const meetingData = meeting.map(({ value }) => value);

        const startups = meetingData.map(({ startups }) => startups);

        setAllVotes(result);
        setMeeting(meetingData);
        setPoints(testing);
        setStartups(...startups);
      } catch (err) {
        setNoVotes(true);
      }
    };
    fetchData();
  }, [meeting]);

  const options = {
    maintainAspectRatio: true,
  };

  if (notVotes) {
    setTimeout(function() {
      setNoVotes(false);
      setReload(true);
    }, 5000);
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='fas fa-person-booth'></i>
        </div>
        <p className='empty-title h5'>No Votes as of this moment.</p>
        <p className='empty-subtitle'>
          Will be redirecting to meeting panel in 5 seconds.
        </p>
      </div>
    );
  }

  if (reload) {
    return <Redirect to='/angels/meetings' />;
  }

  if (meeting.length < 1 || startups.length < 1) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Paper>
        <div className={classes.topContent}>
          <span className={classes.title}>Group votes</span>
          <div className={classes.userContainer}>
            {startups.map(startup => (
              <div className={classes.startupInfo}>
                <>
                  <span className={classes.companyName}>
                    {startup.companyName}
                  </span>
                  <div className={classes.flexCenter}>
                    {allVotes.map(user => {
                      return (
                        <AngelUserDisplay
                          key={user.id}
                          user={user}
                          startup={startup.companyName}
                        />
                      );
                    })}
                  </div>
                </>
              </div>
            ))}
          </div>{' '}
          <span className={classes.title}>Personal Votes</span>
          <div className={classes.userContainer}>
            {startups.map(startup => (
              <div className={classes.startupInfo}>
                <>
                  <div className={classes.flexCenter}>
                    {allVotes.map(user => {
                      return (
                        <AngelUsers
                          key={user.id}
                          user={user}
                          startup={startup.companyName}
                        />
                      );
                    })}
                  </div>
                </>
              </div>
            ))}
          </div>
        </div>
      </Paper>

      <div className={classes.bottomContainer}>
        <div className={classes.startupInfo}>
          <span className={classes.bold}>
            Total Votes based on groups votes
          </span>
        </div>

        <Doughnut
          data={{
            labels: [...startups.map(startup => startup.companyName)],
            datasets: [
              {
                label: '# of Votes',
                data: [
                  ...startups.map(startup => {
                    const data = [points].map((startupPoints, idx) => {
                      return startupPoints[startup.id]
                        ? startupPoints[startup.id]
                        : 0;
                    });
                    return data;
                  }),
                ],

                backgroundColor: [
                  '#003f5c',
                  '#58508d',
                  '#bc5090',
                  '#ff6361',
                  '#ffa600',
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
};

export default AdminMeetingPanel;

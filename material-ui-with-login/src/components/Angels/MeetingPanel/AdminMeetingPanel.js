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

const AdminMeetingPanel = props => {
  const [allVotes, setAllVotes] = useState([]);
  const [meeting, setMeeting] = useState({});
  const [reload, setReload] = useState(false);
  const [notVotes, setNoVotes] = useState(false);
  const [startups, setStartups] = useState([]);
  const [points, setPoints] = useState([]);

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
    <div style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
      <Paper>
        <div
          style={{
            display: 'flex',
            flexFlow: 'column',
            justifyContent: 'space-around',
          }}
        >
          <span
            style={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '15px',
            }}
          >
            Group votes
          </span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '50px',
            }}
          >
            {startups.map(startup => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexFlow: 'column',
                }}
              >
                <>
                  <span style={{ fontWeight: 'bold', textTransform: 'uppercase',  }}>
                    {startup.companyName}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexFlow: 'column',
                    }}
                  >
                    {allVotes.map(user => {
                      return (
                        <AngelUserDisplay
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
          <span
            style={{
              fontWeight: 'bold',
              textTransform: 'uppercase',
              textAlign: 'center',
              marginBottom: '15px',
            }}
          >
            Personal Votes
          </span>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-around',
              marginBottom: '50px',
            }}
          >
            {startups.map(startup => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexFlow: 'column',
                }}
              >
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      flexFlow: 'column',
                    }}
                  >
                    {allVotes.map(user => {
                      return (
                        <AngelUsers user={user} startup={startup.companyName} />
                      );
                    })}
                  </div>
                </>
              </div>
            ))}
          </div>
        </div>
      </Paper>

      <div style={{ marginTop: '20px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontWeight: 'bold' }}>
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
        />
      </div>
    </div>
  );
};

export default AdminMeetingPanel;

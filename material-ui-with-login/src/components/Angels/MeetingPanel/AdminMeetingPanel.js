import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import {
  getVotesByMeeting,
  getMeeting,
  getStartupsAndPointsByMeetingId,
  createBug,
} from '../../../../backend/backend';
import { Redirect } from 'react-router-dom';
import AngelUserDisplay from './AngelUserDisplay';
import { Doughnut } from 'react-chartjs-2';

const AdminMeetingPanel = props => {
  const [allVotes, setAllVotes] = useState([]);
  const [meeting, setMeeting] = useState({});
  const [reload, setReload] = useState(false);

  const [startups, setStartups] = useState([]);
  const [points, setPoints] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bugs = await createBug();

        console.log(bugs);

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
        console.error(err);
        setReload(true);
      }
    };
    fetchData();
  }, []);

  if (reload) {
    return <Redirect to='/angels/meetings' />;
  }

  if (meeting.length < 1 || startups.length < 1) {
    return null;
  }

  return (
    <div style={{ border: '1px solid black', padding: '20px', margin: '20px' }}>
      {allVotes.map(user => {
        return <AngelUserDisplay user={user} />;
      })}
      <div>
        <p>Total Votes based on groups votes</p>

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

                borderColor: [
                  ...startups.map(_ => {
                    const letters = '0123456789ABCDEF';
                    let color = '#';
                    for (let i = 0; i < 6; i++) {
                      color += letters[Math.floor(Math.random() * 16)];
                    }
                    return color;
                  }),
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

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { canVote } from '../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import VotingSystem from './VotingSystem/VotingSystem';

const useStyles = makeStyles(theme => ({
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
  startupView: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
  startupLevel: {
    marginRight: '5px',
  },
}));

const MeetingPanel = ({ users }) => {
  const [vote, setVote] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const classes = useStyles();
  const d = new Date(users.date);

  useEffect(() => {
    const fetchData = async () => {
      const result = await canVote(users.date);

      setVote(result);
    };
    fetchData();
  }, [users]);

  const voting = () => {
    setIsVoting(!isVoting);
  };

  return (
    <div>
      {isVoting ? (
        <VotingSystem users={users} />
      ) : (
        <div key={d}>
          <div className={classes.row}>
            <span className={classes.date}>{d.toDateString()}</span>
            <div className={classes.title}>{users.title}</div>
            {vote && <button onClick={voting}>Vote here</button>}

            <div className={classes.startupView}>
              {users.startups.map((startup, idx) => (
                <div key={idx}>
                  <p className={classes.startupLevel}>{startup.companyName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPanel;

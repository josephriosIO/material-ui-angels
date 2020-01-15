import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { canVote } from '../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import VotingSystem from './VotingSystem/VotingSystem';
import { Link } from 'react-router-dom';

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
    color: 'grey',
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
    alignItems: 'center',
  },
  startupLevel: {
    marginRight: '5px',
    color: '#000',
    '&:visited': {
      color: '#000',
    },
  },
  topContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  voteBtn: {
    color: '#000',
    cursor: 'pointer',
    backgroundColor: 'none',
    borderColor: '#eee',
    borderWidth: 0,
  },
  itemHolder: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
  },
  startups: {
    display: 'flex',
    flexFlow: 'row',
    marginLeft: '180px',
    marginBottom: '20px',
  },
  titleForStartups: {
    fontWeight: 'bold',
    marginLeft: '40px',
    marginTop: '25px',
  },
  checkVotesLink: {
    color: '#000',
    marginRight: '10px',
    '&:visited': {
      color: '#000',
    },
  },
}));

const MeetingPanel = ({ users, roles }) => {
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
            <div className={classes.topContent}>
              <div style={{ display: 'flex' }}>
                <div>
                  <span className={classes.date}>{d.toDateString()}</span>
                  <div className={classes.title}>{users.title}</div>
                </div>
                <span className={classes.titleForStartups}>
                  Startups In Meeting:
                </span>
              </div>
              <div>
                {vote ? <span>Commands</span> : null}
                <div className={classes.itemHolder}>
                  {roles.ADMIN && !vote ? (
                    <Link
                      to={`/angels/editmeeting/${users.id}`}
                      className={classes.checkVotesLink}
                    >
                      Edit
                    </Link>
                  ) : null}

                  {roles.ADMIN && vote ? (
                    <Link
                      to={{
                        pathname: `/angels/meeting/${users.id}`,
                        meeting: { id: users.id },
                      }}
                      className={classes.checkVotesLink}
                    >
                      Check Votes
                    </Link>
                  ) : null}
                  {vote && (
                    <button className={classes.voteBtn} onClick={voting}>
                      Vote here
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className={classes.startups}>
              <div className={classes.startupView}>
                {users.startups.map((startup, idx) => (
                  <div key={idx}>
                    <a
                      rel='noopener noreferrer'
                      target='_blank'
                      href={startup.website}
                      className={classes.startupLevel}
                    >
                      {startup.companyName},
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeetingPanel;

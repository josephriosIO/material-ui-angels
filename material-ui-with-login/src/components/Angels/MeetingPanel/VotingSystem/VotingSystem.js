import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import {
  getMeeting,
  voteOnStartup,
  checkIfUserVoted,
} from '../../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import VoteForStartup from './VoteForStartup';

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
}));

const VotingSystem = ({ users }) => {
  const [startups, setStartups] = useState([]);
  const [userDisabled, setUserDisabled] = useState(false);
  const [groupdisabled, setGroupDisabled] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVote, setUserVote] = useState({
    userVote: 0,
    startup: {},
  });
  const [groupVote, setGroupVote] = useState({
    groupVote: 0,
    startup: {},
  });
  const classes = useStyles();

  const { id } = users;

  useEffect(() => {
    const fetchData = async () => {
      const hasVoted = await checkIfUserVoted(id);
      const result = await getMeeting(id);

      setHasUserVoted(hasVoted);

      setStartups(result);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const setUserVotesToState = (vote, startup) => {
    setUserVote({ userVote: vote, startup: startup });
    setUserDisabled(!userDisabled);
  };

  const setGroupVotesToState = (vote, startup) => {
    setGroupVote({ groupVote: vote, startup: startup });
    setGroupDisabled(!groupdisabled);
  };

  const clearUserVote = () => {
    setUserVote({});
    setUserDisabled(!userDisabled);
  };

  const clearGroupVote = () => {
    setGroupVote({});
    setGroupDisabled(!groupdisabled);
  };

  const confirmVotes = async () => {
    const votes = {
      userVote,
      groupVote,
    };
    try {
      await voteOnStartup(id, votes);
      setHasUserVoted(true);
    } catch (err) {
      console.log(err);
    }
  };

  if (hasUserVoted) {
    return (
      <div className='empty' style={{ marginBottom: '10px' }}>
        <div className='empty-icon'>
          <i class='fas fa-vote-yea'></i>
        </div>
        <p className='empty-title h5'>Thanks for voting!</p>
      </div>
    );
  }

  return (
    <>
      {startups.map(({ value }) => {
        const d = new Date(value.date);
        return (
          <div key={d}>
            <div className={classes.row}>
              <span className={classes.date}>{d.toDateString()}</span>
              <div className={classes.title}>{value.title}</div>
              {userVote?.startup?.companyName ? (
                <div>
                  Your personal vote: {userVote.startup.companyName}
                  <span onClick={clearUserVote}>X</span>
                </div>
              ) : null}
              {groupVote?.startup?.companyName ? (
                <div>
                  Your group vote: {groupVote.startup.companyName}
                  <span onClick={clearGroupVote}>X</span>
                </div>
              ) : null}

              {value.startups.map(startup => (
                <VoteForStartup
                  userDisabled={userDisabled}
                  groupDisabled={groupdisabled}
                  setGroupVotesToState={setGroupVotesToState}
                  setUserVotesToState={setUserVotesToState}
                  startup={startup}
                />
              ))}
            </div>
            <button onClick={confirmVotes}>Submit Votes</button>
          </div>
        );
      })}
    </>
  );
};

export default VotingSystem;

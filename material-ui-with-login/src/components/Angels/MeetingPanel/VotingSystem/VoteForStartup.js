import '@reshuffle/code-transform/macro';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
  },
}));

const VoteForStartup = ({
  startup,
  setUserVotesToState,
  userDisabled,
  groupDisabled,
  setGroupVotesToState,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <p>{startup.companyName}</p>

      <button
        disabled={userDisabled}
        onClick={() => setUserVotesToState(1, startup)}
      >
        Personal vote
      </button>
      <button
        disabled={groupDisabled}
        onClick={() => setGroupVotesToState(1, startup)}
      >
        Group vote
      </button>
    </div>
  );
};

export default VoteForStartup;

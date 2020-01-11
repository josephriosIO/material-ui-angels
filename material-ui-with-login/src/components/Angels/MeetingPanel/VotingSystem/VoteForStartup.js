import '@reshuffle/code-transform/macro';
import React from 'react';

const VoteForStartup = ({
  startup,
  setUserVotesToState,
  userDisabled,
  groupDisabled,
  setGroupVotesToState,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
      }}
    >
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

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { getAngelById } from '../../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  avatarContainer: {
    display: 'flex',
    flexFlow: 'colum',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const AngelUserDisplay = ({ user, startup }) => {
  const [userInfo, setUserInfo] = useState({});
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getAngelById(user.id);

        setUserInfo(...result);
      } catch (err) {}
    };
    fetchData();
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {startup === user.votes.groupVote.startup.companyName ? (
        <div style={{ marginBottom: '5px' }}>
          {' '}
          <Tooltip title={userInfo.name} placement='left-start'>
            <IconButton aria-label={userInfo.name}>
              <i className='fas fa-check-square'></i>
            </IconButton>
          </Tooltip>
        </div>
      ) : null}
    </div>
  );
};

export default AngelUserDisplay;

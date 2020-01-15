import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { getAngelById } from '../../../../backend/backend';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexFlow: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  user: {
    marginBottom: '5px',
  },
}));

const AngelUsers = ({ user, startup }) => {
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
    <div>
      <div className={classes.container}>
        {startup === user.votes.userVote.startup.companyName ? (
          <div className={classes.user}>
            {' '}
            <Tooltip title={userInfo.name} placement='left-start'>
              <IconButton aria-label={userInfo.name}>
                <i className='fas fa-check-square'></i>
              </IconButton>
            </Tooltip>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AngelUsers;

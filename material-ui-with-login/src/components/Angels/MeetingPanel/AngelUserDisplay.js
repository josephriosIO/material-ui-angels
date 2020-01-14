import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { getAngelById } from '../../../../backend/backend';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  avatarContainer: {
    display: 'flex',
    flexFlow: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

const AngelUserDisplay = ({ user }) => {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>
          <div className={classes.avatarContainer}>
            <Avatar src={userInfo.img} alt={userInfo.name} />
            <p>{userInfo.name}</p>
          </div>
        </Typography>
        <p>
          Personal Vote for:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {user.votes.userVote.startup.companyName}
          </span>
        </p>
        <p>
          Group Vote for:{' '}
          <span style={{ fontWeight: 'bold' }}>
            {user.votes.groupVote.startup.companyName}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AngelUserDisplay;

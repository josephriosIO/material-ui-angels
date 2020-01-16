import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  angelContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexFlow: 'column',
    width: '30%',
    marginBottom: '30px',
    [theme.breakpoints.down('md')]: {
      width: '40%',
    },
  },
  avatarResize: {
    width: '200px',
    height: '190px',
    [theme.breakpoints.down('md')]: {
      width: '120px',
      height: '120px',
    },
  },
}));

const DashboardAngelsList = ({ angels }) => {
  const classes = useStyles();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        flexFlow: 'wrap',
      }}
    >
      {angels.map(angel => (
        <div className={classes.angelContainer}>
          <Avatar
            className={classes.avatarResize}
            src={angel.img}
            alt={angel.name}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardAngelsList;

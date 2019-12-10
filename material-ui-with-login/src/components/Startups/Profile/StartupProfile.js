import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  gridList: {
    width: '100%',
    height: '100%',
  },
  tile: {
    backgroundColor: '#e9ccb1',
  },
}));

const StartupProfile = props => {
  const classes = useStyles();
  const { item } = props;
  console.log(item);
  return (
    <div className={classes.root}>
      <GridList cellHeight={160} className={classes.gridList} cols={3}>
        <GridListTile className={classes.tile} key={item.id} cols={2}>
          <img src={item.img} alt={item.companyName} />

          <GridListTileBar
            title={<span>Company Name:</span>}
            subtitle={<span>{item.companyName}</span>}
          />
        </GridListTile>
        <GridListTile className={classes.tile} key={item.id} cols={1}>
          <GridListTileBar
            title={<span>Location:</span>}
            subtitle={<span>{item.location}</span>}
          />
        </GridListTile>
        <GridListTile className={classes.tile} key={item.id} cols={3}>
          <GridListTileBar title={<span>Mission statement:</span>} />
          <p>lorem ispum</p>
        </GridListTile>
        <GridListTile className={classes.tile} key={item.id} cols={1}>
          <GridListTileBar
            title={<span>Company size:</span>}
            subtitle={<span>{item.companySize}</span>}
          />
        </GridListTile>
        <GridListTile className={classes.tile} key={item.id} cols={2}>
          <img src='data:image/jpeg;base64,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' />
          <GridListTileBar
            title={<span>Phone number:</span>}
            subtitle={
              <span>{item.phoneNumber ? item.phoneNumber : 'Empty'}</span>
            }
          />
        </GridListTile>
      </GridList>
      <button>
        <Link to={`/startups/profile/${item.id}`}>EDIT</Link>
      </button>
    </div>
  );
};

export default StartupProfile;

import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import { getStartup } from '../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const user = await getStartup();

      setUser(...user);
    };
    fetchData();
  }, []);

  //use new component to display all items from startup profile
  //have an edit button which will take you to Profile.js component || in navbar?
  // choose a nice styling for all components maybe look up components or templates with nicer CMS styles?
  // clean up code to make it more readable
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>{user.companyName}</Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default HomePage;

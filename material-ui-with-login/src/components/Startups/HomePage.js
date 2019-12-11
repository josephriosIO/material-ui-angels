import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import StartupProfile from './Profile/StartupProfile';
import { getStartup } from '../../../backend/backend';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
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

  //use new component to display all items from startup profile CHECK
  //have an edit button which will take you to Profile.js component || in navbar?
  // choose a nice styling for all components maybe look up components or templates with nicer CMS styles?
  // clean up code to make it more readable
  return (
    <div className={classes.root}>
      <StartupProfile item={user} />
    </div>
  );
};

export default HomePage;

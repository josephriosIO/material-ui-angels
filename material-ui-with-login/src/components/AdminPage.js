import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import DisplayUsers from './DisplayUsers';

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
}));

const AdminPage = props => {
  const classes = useStyles();
  const { users } = props.location.state;

  return (
    <>
      <CssBaseline />
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        {users.length > 0 ? (
          users.map(user => <DisplayUsers user={user} />)
        ) : (
          <Typography
            component='h1'
            variant='h2'
            align='center'
            color='textSecondary'
            gutterBottom
          >
            No Users
          </Typography>
        )}
      </Container>
    </>
  );
};

export default AdminPage;

import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { setUsersToBackend, getUsers } from '../../backend/backend';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';

const useStyles = makeStyles(theme => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: 'none',
    },
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor: theme.palette.grey[200],
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

export default function Page() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const { loading, authenticated, profile } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const result = await getUsers();
      if (profile) {
        await setUsersToBackend(profile.displayName, profile.picture);
      }
      if (result) {
        setUsers(result);
      }
    };
    fetchData();
  }, []);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // wait for the user data to load.
  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  // not best case constantly hitting backend
  // if (authenticated) {
  //   setUsersToBackend(profile.displayName, profile.picture).then(user =>
  //     setUsers(user),
  //   );
  // }

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <Typography component='h4' variant='h4' align='center' gutterBottom>
          <div className={classes.tableWrapper}>
            {users
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map(user => (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Paper>
                      <div
                        key={user.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <p style={{ marginBottom: '15px' }}>{user.name}</p>
                        {user.angel ? (
                          <Tooltip title='Angel'>
                            <Avatar src={user.img} alt={user.name} />
                          </Tooltip>
                        ) : (
                          <Avatar src={user.img} alt={user.name} />
                        )}
                      </div>
                    </Paper>
                  </Grid>
                </Grid>
              ))}
          </div>
          <TablePagination
            rowsPerPageOptions={[1, 5, 10]}
            component='div'
            count={users.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Typography>
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
}

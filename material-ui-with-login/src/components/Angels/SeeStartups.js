import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { getAllStartups, getRole } from '../../../backend/backend';
import SearchBar from './SearchBar';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import CardView from './Cards/CardView';

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
  root: {
    overflowX: 'auto',
    marginRight: 'auto',
    marginLeft: 'auto',
    marginTop: '50px',
    padding: '10px',
    margin: '10px',
  },
  tableWrapper: {
    maxHeight: '100%',
    overflow: 'auto',
  },
  tableRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

export default function SeeStartups() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(1);
  const [filter, setFilter] = useState([]);
  const [roles, setRoles] = useState([]);
  const classes = useStyles();
  const { loading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const usersRoles = await getRole();

      if (usersRoles.ADMIN || usersRoles.ANGEL) {
        const result = await getAllStartups();
        setUsers(result);
      }

      setRoles(usersRoles);
    };
    fetchData();
    // eslint-disable-next-line
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

  const search = e => {
    const filteredUsers = users.filter(user => {
      if (user.companyName.toLowerCase().includes(e.target.value)) {
        return user;
      }

      return null;
    });

    setFilter(filteredUsers);
  };

  if (!roles.ADMIN && !roles.ANGEL) {
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='icon icon-people'></i>
        </div>
        <p className='empty-title h5'>Thank you for your request!</p>
        <p className='empty-subtitle'>
          To see upcoming startups please have an admin confirm you as an angel.
        </p>
      </div>
    );
  }

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth='lg' component='main' className={classes.heroContent}>
        {users.length < 1 ? (
          <div className='empty'>
            <div className='empty-icon'>
              <i className='icon icon-people'></i>
            </div>
            <p className='empty-title h5'>No Startups :(</p>
            <p className='empty-subtitle'>
              Have some startups join the platform!
            </p>
          </div>
        ) : (
          <Grid>
            <div className={classes.root}>
              <div className={classes.flex}>
                <h2>Startups</h2>
                <SearchBar search={search} title={'Company Name'} />
              </div>

              <div className={classes.tableWrapper}>
                <Table stickyHeader aria-label='sticky table'>
                  <TableBody>
                    {filter.length > 0
                      ? filter
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                          .map(row =>
                            row ? (
                              <TableRow
                                className={classes.tableRow}
                                role='checkbox'
                                tabIndex={-1}
                                key={row.id}
                              >
                                <CardView row={row} />
                              </TableRow>
                            ) : null,
                          )
                      : users
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage,
                          )
                          .map(row =>
                            row ? (
                              <TableRow
                                className={classes.tableRow}
                                role='checkbox'
                                tabIndex={-1}
                                key={row.id}
                              >
                                <CardView row={row} />
                              </TableRow>
                            ) : null,
                          )}
                  </TableBody>
                </Table>
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
            </div>
          </Grid>
        )}
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
}

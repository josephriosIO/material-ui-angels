import '@reshuffle/code-transform/macro';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@reshuffle/react-auth';
import { setUsersToBackend, getUsers } from '../../../backend/backend';

import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Avatar from '@material-ui/core/Avatar';

const columns = [
  { id: 'name', align: 'center', label: 'Name', minWidth: 170 },
  { id: 'location', align: 'right', label: 'Location', minWidth: 100 },
  {
    id: 'email',
    label: 'Email',
    minWidth: 170,
    align: 'center',
    format: value => value.toLocaleString(),
  },
  {
    id: 'phoneNumber',
    label: 'Phone Number',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString(),
  },
  {
    id: 'bio',
    label: 'Bio',
    minWidth: 170,
    align: 'right',
    format: value => value.toLocaleString(),
  },
];

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
    maxHeight: 440,
    overflow: 'auto',
  },
}));

export default function Page() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();
  const { loading, profile } = useAuth();

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

  return (
    <React.Fragment>
      <CssBaseline />
      {/* Hero unit */}
      <Container maxWidth='lg' component='main' className={classes.heroContent}>
        {users.length < 1 ||
        users.filter(user => user.angel === true).length <= 0 ? (
          <div class='empty'>
            <div class='empty-icon'>
              <i class='icon icon-people'></i>
            </div>
            <p class='empty-title h5'>No Angels :(</p>
            <p class='empty-subtitle'>
              Click login for an admin to set you as an angel.
            </p>
          </div>
        ) : (
          <Grid>
            <Paper className={classes.root}>
              <h2>Angels</h2>
              <div className={classes.tableWrapper}>
                <Table stickyHeader aria-label='sticky table'>
                  <TableHead>
                    <TableRow>
                      {columns.map(column => (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={{ minWidth: column.minWidth }}
                        >
                          {column.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage,
                      )
                      .map(row =>
                        row.angel ? (
                          <TableRow
                            hover
                            role='checkbox'
                            tabIndex={-1}
                            key={row.id}
                          >
                            {columns.map((column, count = 0) => {
                              count += 1;
                              let value = row[column.id];

                              if (Array.isArray(value)) {
                                value = value[0].value;
                              }

                              if (value === '' || value === null) {
                                value = 'N/A';
                              }

                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <div
                                    style={{
                                      display: 'flex',
                                      justifyContent: 'flex-end',
                                    }}
                                  >
                                    {count < 2 ? (
                                      <Avatar src={row.img} alt={row.name} />
                                    ) : null}
                                    {value}
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ) : null,
                      )}
                  </TableBody>
                </Table>
              </div>
              <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component='div'
                count={users.filter(user => user.angel === true).length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        )}
      </Container>
      {/* End hero unit */}
    </React.Fragment>
  );
}

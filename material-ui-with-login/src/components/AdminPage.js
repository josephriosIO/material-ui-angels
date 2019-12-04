import React, { useState } from 'react';
import DisplayUsers from './DisplayUsers';
import Error from './Errors/Error';
import SearchBar from './SearchBar';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';

const useStyles = makeStyles(theme => ({
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  tableWrapper: {
    overflowX: 'auto',
  },
}));

const AdminPage = props => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [filter, setFilter] = useState([]);
  const { users } = props.location.state;
  const classes = useStyles();

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const search = e => {
    const filteredUsers = users.filter(user => {
      if (user.name.toLowerCase().includes(e.target.value)) {
        return user;
      }

      return null;
    });

    setFilter(filteredUsers);
  };

  const callErrors = boolean => {
    if (boolean) {
      setErrorMsg('Saved.');
      setErrorStatus('success');
      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
    } else {
      setErrorMsg('Removed.');
      setErrorStatus('success');
      setTimeout(() => {
        setErrorMsg('');
      }, 3000);
    }
  };

  return (
    <>
      <Error errorMsg={errorMsg} color={errorStatus} />
      <CssBaseline />
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <SearchBar search={search} />
        <div className={classes.tableWrapper}>
          {filter.length > 0
            ? filter
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => (
                  <DisplayUsers
                    key={user.id}
                    callErrors={callErrors}
                    user={user}
                  />
                ))
            : users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => (
                  <DisplayUsers
                    key={user.id}
                    callErrors={callErrors}
                    user={user}
                  />
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
      </Container>
    </>
  );
};

export default AdminPage;

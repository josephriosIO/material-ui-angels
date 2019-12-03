import React, { useState } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import DisplayUsers from './DisplayUsers';
import Error from './Errors/Error';
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
  const { users } = props.location.state;
  const classes = useStyles();

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
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
        <div className={classes.tableWrapper}>
          {users
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map(user => (
              <DisplayUsers key={user.id} callErrors={callErrors} user={user} />
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

import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import DisplayUsers from './DisplayUsers';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';

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
  const classes = useStyles();
  const { users } = props.location.state;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth='sm' component='main' className={classes.heroContent}>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label='sticky table'>
            
            <TableBody>
              {users
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(user => (
                  <DisplayUsers user={user} />
                ))}
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
      </Container>
    </>
  );
};

export default AdminPage;

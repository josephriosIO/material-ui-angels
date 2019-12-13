import '@reshuffle/code-transform/macro';
import React, { useState, useEffect, useRef } from 'react';
import DisplayUsers from './DisplayUsers';
import Error from '../Errors/Error';
import SearchBar from './SearchBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TablePagination from '@material-ui/core/TablePagination';
import {
  getAllUsersThatAreNotAStartup,
  createOrGetInvite,
} from '../../../backend/backend';

const useStyles = makeStyles(theme => ({
  header: {
    borderBottom: '1px solid #e7e9eb',
    padding: '56px 0',
    marginBottom: '28px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItem: 'center',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      alignItems: 'center',
      flexFlow: 'column',
    },
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      maxWidth: '988px',
      marginRight: 'auto',
      marginLeft: 'auto',
      paddingLeft: '14px',
      paddingRight: '14px',
    },
  },
  body: {
    display: 'flex',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      flexFlow: 'column',
    },
  },
  column: {
    margin: '0 20px',
    width: '50%',
    display: 'flex',
    flexFlow: 'column',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      width: '100%',
    },
  },
}));

const AdminPage = props => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorStatus, setErrorStatus] = useState('');
  const [filter, setFilter] = useState([]);
  const [users, setUsers] = useState([]);
  const [invite, setInvite] = useState({});
  const classes = useStyles();
  const url = window.location.href;
  const urlArr = url.split('/');
  const domain = urlArr[0] + '//' + urlArr[2];
  const [copySuccess, setCopySuccess] = useState('');
  const textAreaRef = useRef(null);

  function copyToClipboard(e) {
    textAreaRef.current.select();
    document.execCommand('copy');
    // This is just personal preference.
    // I prefer to not show the the whole text area selected.
    e.target.focus();
    setCopySuccess('Copied!');
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await getAllUsersThatAreNotAStartup();
      const createdInvite = await createOrGetInvite();

      setInvite(createdInvite);

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
      <div className={classes.layout}>
        <div className={classes.header}>
          <Typography variant='h6' gutterBottom>
            Admin
          </Typography>
        </div>
        <div className={classes.body}>
          <div className={classes.column}>
            <div>
              <h2>Invite link</h2>
              <textarea
                ref={textAreaRef}
                value={`${domain}/invite/${invite.value}`}
              />

              <div>
                <button onClick={copyToClipboard}>
                  {' '}
                  {copySuccess ? copySuccess : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          <div className={classes.column}>
            <SearchBar search={search} title={'name'} />
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;

import '@reshuffle/code-transform/macro';
import React, { useEffect, useState } from 'react';
import {
  getVotesByMeeting,
  getMeeting,
  getStartupsAndPointsByMeetingId,
} from '../../../../backend/backend';
import { Redirect } from 'react-router-dom';
import AngelUserDisplay from './AngelUserDisplay';
import AngelUsers from './AngelUsers';
import { Doughnut } from 'react-chartjs-2';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { id: 'id', align: 'left', label: "Angel's Name", minWidth: 170 },
  { id: 'groupVote', align: 'left', label: 'Group Vote', minWidth: 100 },
  { id: 'userVote', align: 'left', label: 'Personal Vote', minWidth: 100 },
];

const useStyles = makeStyles(theme => ({
  container: {
    border: '1px solid black',
    padding: '20px',
    margin: '20px',
  },
  topContent: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-around',
  },
  title: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: '15px',
  },
  userContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    marginBottom: '50px',
  },
  startupInfo: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
  },
  companyName: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
  },
  bottomContainer: {
    marginTop: '20px',
  },
  bold: {
    fontWeight: 'bold',
  },
}));

const AdminMeetingPanel = props => {
  const [allVotes, setAllVotes] = useState([]);
  const [meeting, setMeeting] = useState({});
  const [reload, setReload] = useState(false);
  const [notVotes, setNoVotes] = useState(false);
  const [startups, setStartups] = useState([]);
  const [points, setPoints] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getVotesByMeeting(props?.location?.meeting?.id);

        const meeting = await getMeeting(props?.location?.meeting?.id);
        const testing = await getStartupsAndPointsByMeetingId(
          props?.location?.meeting?.id,
        );

        const meetingData = meeting.map(({ value }) => value);

        const startups = meetingData.map(({ startups }) => startups);

        setAllVotes(result);
        setMeeting(meetingData);
        setPoints(testing);
        setStartups(...startups);
      } catch (err) {
        setNoVotes(true);
      }
    };
    fetchData();
  }, [props]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const options = {
    maintainAspectRatio: true,
  };

  if (notVotes) {
    setTimeout(function() {
      setNoVotes(false);
      setReload(true);
    }, 5000);
    return (
      <div className='empty'>
        <div className='empty-icon'>
          <i className='fas fa-person-booth'></i>
        </div>
        <p className='empty-title h5'>No Votes as of this moment.</p>
        <p className='empty-subtitle'>
          Will be redirecting to meeting panel in 5 seconds.
        </p>
      </div>
    );
  }

  if (reload) {
    return <Redirect to='/angels/meetings' />;
  }

  if (meeting.length < 1 || startups.length < 1) {
    return null;
  }

  return (
    <div className={classes.container}>
      <Grid>
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
              {allVotes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(row => (
                  <TableRow tabIndex={-1} key={row.id}>
                    {columns.map(column => {
                      let value = row[column.id];
                      let votes = row.votes[column.id];

                      if (value === '' || value === null) {
                        value = 'N/A';
                      }

                      return (
                        <AngelUserDisplay
                          value={value}
                          votes={votes}
                          column={column}
                        />
                      );
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[1, 5, 25]}
          component='div'
          count={allVotes.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Grid>

      <div className={classes.bottomContainer}>
        <div className={classes.startupInfo}>
          <span className={classes.bold}>
            Total Votes based on groups votes
          </span>
        </div>

        <Doughnut
          data={{
            labels: [...startups.map(startup => startup.companyName)],
            datasets: [
              {
                label: '# of Votes',
                data: [
                  ...startups.map(startup => {
                    const data = [points].map((startupPoints, idx) => {
                      return startupPoints[startup.id]
                        ? startupPoints[startup.id]
                        : 0;
                    });
                    return data;
                  }),
                ],

                backgroundColor: [
                  '#003f5c',
                  '#58508d',
                  '#bc5090',
                  '#ff6361',
                  '#ffa600',
                ],
                borderWidth: 1,
              },
            ],
          }}
          options={options}
        />
      </div>
    </div>
  );
};

export default AdminMeetingPanel;

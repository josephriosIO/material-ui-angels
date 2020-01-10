import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

const columns = [
  { id: 'companyName', align: 'left', label: 'Company Name', minWidth: 170 },
  { id: 'location', align: 'left', label: 'Location', minWidth: 100 },
  {
    id: 'website',
    label: 'Website',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
  {
    id: 'companySize',
    label: '# of Employees',
    minWidth: 170,
    align: 'left',
    format: value => value.toLocaleString(),
  },
  {
    id: 'missionStatement',
    label: 'Mission Statement',
    minWidth: 170,
    align: 'left',
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
    backgroundColor: '#fafafa',
  },
  cellTable: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  addBtn: {
    width: '100px',
    height: '55px',
    fontSize: '16px',
    textTransform: 'uppercase',
    color: '#000',
    background: '#eee !',
    border: '1px solid #000',
    cursor: 'pointer',

    '&:disabled': {
      background: '#d3d3d3 !important',
      cursor: 'default',
      border: '0',
    },
  },
}));

const AllStartupsViewTable = props => {
  const [state, setState] = useState({
    archieved: false,
    vetted: false,
  });
  const { user } = props;
  const classes = useStyles();
  const { archieved, vetted } = state;

  useEffect(() => {
    const fetchData = async () => {
      console.log(user);
      setState({
        archieved: user.archived,
        vetted: user.vetted,
      });
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const vetStartup = () => {
    setState({ ...state, vetted: !vetted });
    return props.vett(user, vetted);
  };

  const archivedStartup = () => {
    setState({ ...state, archieved: !archieved });
    return props.archived(user, archieved);
  };

  return (
    <>
      <TableRow role='checkbox' tabIndex={-1}>
        {columns.map(column => {
          let value = user[column.id];

          if (value === '' || value === null) {
            value = 'N/A';
          }

          return (
            <TableCell key={column.id} align={column.align}>
              <div className={classes.cellTable}>{value}</div>
            </TableCell>
          );
        })}
        <div style={{ display: 'flex', flexFlow: 'column' }}>
          <FormControlLabel
            control={
              <Checkbox
                onChange={() => vetStartup()}
                name='vetted'
                checked={vetted}
                value='vetted'
                inputProps={{
                  'aria-label': 'primary checkbox',
                }}
              />
            }
            label='Vetted'
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={archieved}
                onChange={() => archivedStartup()}
                name='archieved'
                value='archieved'
                color='primary'
                inputProps={{
                  'aria-label': 'secondary checkbox',
                }}
              />
            }
            label='Archived'
          />
        </div>
      </TableRow>
    </>
  );
};

export default AllStartupsViewTable;

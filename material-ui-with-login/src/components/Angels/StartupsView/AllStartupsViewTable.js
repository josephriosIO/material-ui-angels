import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)(props => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant='h6'>{children}</Typography>
      {onClose ? (
        <IconButton
          aria-label='close'
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles(theme => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);

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
  cellTable: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  flex: {
    display: 'flex',
    flexFlow: 'column',
  },
}));

const AllStartupsViewTable = props => {
  const [state, setState] = useState({
    archieved: false,
    vetted: false,
  });
  const { user } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { archieved, vetted } = state;

  useEffect(() => {
    const fetchData = async () => {
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
    props.vett(user, vetted);
  };

  const archivedStartup = () => {
    setState({ ...state, archieved: !archieved });
    props.archived(user, archieved);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <TableRow hover style={{ cursor: 'pointer' }} onClick={handleClickOpen}>
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
      </TableRow>
      <Dialog
        onClose={handleClose}
        aria-labelledby='customized-dialog-title'
        open={open}
      >
        <DialogContent dividers>
          <td className={classes.flex}>
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
          </td>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} color='primary'>
            Save changes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AllStartupsViewTable;

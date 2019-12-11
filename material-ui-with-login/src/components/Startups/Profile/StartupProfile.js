import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';

const ColorButton = withStyles(theme => ({
  root: {
    color: '#494949 !important',
    textTransform: 'uppercase',
    textDecoration: 'none',
    background: '#fff',
    padding: '5px',
    border: '4px solid #494949 !important',
    display: 'inline-block',
    transition: 'all 0.4s ease 0s',
    '&:hover': {
      color: '#ffffff !important',
      background: '#f6b93b',
      borderColor: '#f6b93b !important',
      transition: 'all 0.4s ease 0s',
    },
  },
}))(Button);

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const StartupProfile = props => {
  const classes = useStyles();
  const { item } = props;

  return (
    <div>
      <div className={classes.header}>
        <h3>Welcome back, {item.name}</h3>
        <ColorButton>
          <Link
            style={{ textDecoration: 'none', color: 'black' }}
            to={`/startups/profile/${item.id}`}
          >
            EDIT PROFILE
          </Link>
        </ColorButton>
      </div>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography className={classes.heading}>Company Name</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {item.companyName ? item.companyName : 'Not Entered'}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography className={classes.heading}> Company Location</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {item.location ? item.location : 'Not Entered'}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography className={classes.heading}>
            {' '}
            Company's Mission Statement
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {item.missionStatement ? item.missionStatement : 'Not Entered'}{' '}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography className={classes.heading}> Company Size</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <Typography>
            {item.companySize ? item.companySize : 'Not Entered'}{' '}
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
};

export default StartupProfile;

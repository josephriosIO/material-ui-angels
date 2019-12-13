import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles(theme => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '50px 30px',
  },
  card: {
    width: '50%',
    marginBottom: '50px',
    [theme.breakpoints.down(600 + theme.spacing(2) * 2)]: {
      width: '80%',
    },
  },
  media: {
    height: 200,
  },
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoItems: {
    display: 'flex',
    flexFlow: 'column',
  },
  items: {
    lineHeight: 2.5,
  },
}));

const CardView = props => {
  const classes = useStyles();
  const { row } = props;
  const maxlimit = 360;
  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          image='https://www.smallcellforum.org/site/wp-content/uploads/2018/01/SCF-Downtown-Silicon-Valley.jpg'
          title='skyline'
        />
        <CardContent>
          <Typography gutterBottom variant='h5' component='h2'>
            {row.companyName ? row.companyName : 'Not Entered'}
          </Typography>
          <Typography variant='body2' color='textSecondary' component='p'>
            {row.missionStatement
              ? row.missionStatement.length > maxlimit
                ? row.missionStatement.substring(0, maxlimit - 3) + '...'
                : row.missionStatement
              : 'Not Entered'}{' '}
          </Typography>
        </CardContent>
      </CardActionArea>

      <ExpansionPanel>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Button size='small' color='primary'>
            More Info
          </Button>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div className={classes.infoItems}>
            <Typography className={classes.items}>
              Website: {row.website ? row.website : 'Not Entered'}{' '}
            </Typography>
            <Typography className={classes.items}>
              Location: {row.location ? row.location : 'Not Entered'}{' '}
            </Typography>
            <Typography className={classes.items}>
              # of Employees:{' '}
              {row.companySize ? row.companySize : 'Not Entered'}{' '}
            </Typography>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </Card>
  );
};

export default CardView;

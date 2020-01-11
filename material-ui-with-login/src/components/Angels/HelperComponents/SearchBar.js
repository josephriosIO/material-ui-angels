import React from 'react';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  formHolder: {
    marginBottom: '30px',
  },
  text: {
    width: '260px',
  },
}));

const SearchBar = props => {
  const classes = useStyles();
  return (
    <form noValidate autoComplete='on' className={classes.formHolder}>
      <TextField
        className={classes.text}
        id='standard-basic'
        onKeyDown={props.search}
        label={`Search By ${props.title}`}
      />
    </form>
  );
};

export default SearchBar;

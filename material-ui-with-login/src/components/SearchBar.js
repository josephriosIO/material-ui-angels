import React from 'react';
import TextField from '@material-ui/core/TextField';

const SearchBar = props => {
  return (
    <form noValidate autoComplete='off'>
      <TextField id='standard-basic' onKeyDown={props.search} label='Search' />
    </form>
  );
};

export default SearchBar;

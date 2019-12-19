import React from 'react';
import TextField from '@material-ui/core/TextField';

const SearchBar = (props) => {
  return (
    <form noValidate autoComplete='on' style={{ marginBottom: '30px' }}>
      <TextField
        style={{ width: '260px' }}
        id='standard-basic'
        onKeyDown={props.search}
        label={`Search By ${props.title}`}
      />
    </form>
  );
};

export default SearchBar;

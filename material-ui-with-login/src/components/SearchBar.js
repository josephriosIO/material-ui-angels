import React from 'react';

const SearchBar = props => {
  return (
    <div>
      <input type='search' onKeyDown={props.search} placeholder='Search' />
    </div>
  );
};

export default SearchBar;

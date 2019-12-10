import React from 'react';
import Paper from '@material-ui/core/Paper';

const StartupProfile = props => {
  const { item } = props;
  console.log(item);
  return (
    <div>
      <Paper>{item.companyName}</Paper>
    </div>
  );
};

export default StartupProfile;

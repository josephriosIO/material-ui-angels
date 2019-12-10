import React from 'react';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom';

const StartupProfile = props => {
  const { item } = props;
  console.log(item);
  return (
    <div>
      <Paper>{item.companyName}</Paper>
      <Paper>{item.location}</Paper>
      <Paper>{item.phoneNumber}</Paper>
      <Paper>{item.missionStatement}</Paper>
      <Paper>{item.companySize}</Paper>
      <Paper>{item.funded}</Paper>
      <button>
        <Link to={`/startups/profile/${item.id}`}>EDIT</Link>
      </button>
    </div>
  );
};

export default StartupProfile;

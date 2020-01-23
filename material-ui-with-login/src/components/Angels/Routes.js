import React from 'react';
import Dashboard from './Dashboard/Dashboard';
import AdminPage from './AdminPanel/AdminPage';
import Profile from './Profile/Profile';
import NavBar from './Nav/NavBar';
import SeeStartups from './MeetingPanel/SeeStartups';
import Protected from '../PrivateRoute/PrivateRoute';
import MeetingCreator from './MeetingPanel/MeetingCreator';
import AllStartupsView from './StartupsView/AllStartupsView';
import VotingSystem from './MeetingPanel/VotingSystem/VotingSystem';
import AdminMeetingPanel from './MeetingPanel/AdminMeetingPanel';
import EditMeeting from './MeetingPanel/EditMeeting';

const Routes = props => {
  return (
    <>
      <Protected path={props.match.path} component={NavBar} />

      <Protected exact path={props.match.path} component={Dashboard} />

      <Protected
        exact
        path={`${props.match.path}/admin`}
        component={AdminPage}
      />
      <Protected
        exact
        path={`${props.match.path}/profile/:id`}
        component={Profile}
      />
      <Protected
        exact
        path={`${props.match.path}/meetings`}
        component={SeeStartups}
      />
      <Protected
        exact
        path={`${props.match.path}/meeting/:id`}
        component={AdminMeetingPanel}
      />
      <Protected
        exact
        path={`${props.match.path}/createmeeting`}
        component={MeetingCreator}
      />
      <Protected
        exact
        path={`${props.match.path}/editmeeting/:id`}
        component={EditMeeting}
      />
      <Protected
        exact
        path={`${props.match.path}/startups`}
        component={AllStartupsView}
      />
      <Protected
        exact
        path={`${props.match.path}/vote`}
        component={VotingSystem}
      />
    </>
  );
};

export default Routes;
